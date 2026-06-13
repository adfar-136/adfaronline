"use my-server-action"; // wait, the standard directive for server actions is "use server" at the top of the file.
"use server";

import { getDb } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { siteConfig } from "@/data/site";
import { resolveYouTubeThumbnail } from "@/lib/youtube";

// Helper to ensure database indexes are initialized
let indexCreated = false;
async function ensureIndexes() {
  if (indexCreated) return;
  try {
    const db = await getDb();
    await db.collection("registrations").createIndex(
      { masterclassId: 1, userId: 1 },
      { unique: true }
    );
    indexCreated = true;
  } catch (e) {
    console.error("Failed to create registrations unique index", e);
  }
}

// Masterclass creation schema
const masterclassSchema = z.object({
  title: z.string().min(1, "Title is required"),
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().transform((val) => new Date(val)),
  time: z.string().min(1, "Time is required"),
  durationMins: z.coerce.number().min(1, "Duration must be positive"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  capacity: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? null : val),
    z.coerce.number().min(1).nullable()
  ),
  status: z.enum(["open", "closed"]).default("open"),
  paymentNote: z.string().min(1, "Payment note is required"),
});

// Helper: check admin authorization
async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || session.user.email !== siteConfig.email) {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

// Helper: check user authorization
async function checkUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized: Please log in first");
  }
  return session;
}

// ==========================================
// 1. USER ACTIONS
// ==========================================

/**
 * Registers the current user for a masterclass.
 */
export async function registerForMasterclass(masterclassId: string) {
  try {
    const session = await checkUser();
    await ensureIndexes();
    const db = await getDb();

    // Find masterclass
    const mId = new ObjectId(masterclassId);
    const masterclass = await db.collection("masterclasses").findOne({ _id: mId });

    if (!masterclass) {
      return { success: false, error: "Masterclass not found" };
    }

    if (masterclass.status !== "open") {
      return { success: false, error: "Registrations are closed for this masterclass" };
    }

    // Check if capacity is reached
    if (masterclass.capacity !== null) {
      const currentRegCount = await db.collection("registrations").countDocuments({ masterclassId: mId });
      if (currentRegCount >= masterclass.capacity) {
        return { success: false, error: "This masterclass is fully booked" };
      }
    }

    // Attempt insertion (unique index prevents duplicate registrations)
    try {
      await db.collection("registrations").insertOne({
        masterclassId: mId,
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        createdAt: new Date(),
      });
    } catch (dbErr: any) {
      if (dbErr.code === 11000) {
        return { success: false, error: "You are already registered for this masterclass" };
      }
      throw dbErr;
    }

    // Revalidate paths to sync button states and registration counts
    revalidatePath("/");
    revalidatePath("/masterclass");
    revalidatePath("/dashboard");
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register" };
  }
}

// ==========================================
// 2. ADMIN ACTIONS
// ==========================================

/**
 * Creates/announces a new masterclass.
 */
export async function createMasterclass(formData: any) {
  try {
    await checkAdmin();
    const db = await getDb();

    // Validate form input
    const validated = masterclassSchema.parse(formData);

    const result = await db.collection("masterclasses").insertOne({
      ...validated,
      createdAt: new Date(),
    });

    revalidatePath("/");
    revalidatePath("/masterclass");
    revalidatePath("/admin");

    return { success: true, id: result.insertedId.toString() };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    return { success: false, error: err.message || "Failed to create masterclass" };
  }
}

/**
 * Updates an existing masterclass.
 */
export async function updateMasterclass(id: string, formData: any) {
  try {
    await checkAdmin();
    const db = await getDb();

    // Validate input
    const validated = masterclassSchema.parse(formData);
    const mId = new ObjectId(id);

    await db.collection("masterclasses").updateOne(
      { _id: mId },
      { $set: validated }
    );

    revalidatePath("/");
    revalidatePath("/masterclass");
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message };
    }
    return { success: false, error: err.message || "Failed to update masterclass" };
  }
}

/**
 * Toggles a masterclass's status between "open" and "closed".
 */
export async function toggleMasterclassStatus(id: string, status: "open" | "closed") {
  try {
    await checkAdmin();
    const db = await getDb();
    const mId = new ObjectId(id);

    await db.collection("masterclasses").updateOne(
      { _id: mId },
      { $set: { status } }
    );

    revalidatePath("/");
    revalidatePath("/masterclass");
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to toggle status" };
  }
}

/**
 * Deletes a masterclass and all associated student registrations.
 */
export async function deleteMasterclass(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const mId = new ObjectId(id);

    // Delete masterclass
    await db.collection("masterclasses").deleteOne({ _id: mId });
    // Delete registrations
    await db.collection("registrations").deleteMany({ masterclassId: mId });

    revalidatePath("/");
    revalidatePath("/masterclass");
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete masterclass" };
  }
}

// ==========================================
// 3. CMS EXPERIENCE ACTIONS
// ==========================================

export async function createExperience(data: {
  company: string;
  role: string;
  period: string;
  description: string;
  order: number;
}) {
  try {
    await checkAdmin();
    const db = await getDb();
    
    await db.collection("experiences").insertOne({
      company: data.company,
      role: data.role,
      period: data.period,
      description: data.description,
      order: Number(data.order),
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create experience" };
  }
}

export async function updateExperience(id: string, data: {
  company: string;
  role: string;
  period: string;
  description: string;
  order: number;
}) {
  try {
    await checkAdmin();
    const db = await getDb();
    const eId = new ObjectId(id);

    await db.collection("experiences").updateOne(
      { _id: eId },
      {
        $set: {
          company: data.company,
          role: data.role,
          period: data.period,
          description: data.description,
          order: Number(data.order),
          updatedAt: new Date()
        }
      }
    );

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update experience" };
  }
}

export async function deleteExperience(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const eId = new ObjectId(id);

    await db.collection("experiences").deleteOne({ _id: eId });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete experience" };
  }
}

// ==========================================
// 4. CMS PROJECT ACTIONS
// ==========================================

export async function createProject(data: {
  title: string;
  description: string;
  tech: string | string[];
  githubUrl: string;
  liveUrl: string;
  thumbnail: string;
  order: number;
}) {
  try {
    await checkAdmin();
    const db = await getDb();

    await db.collection("projects").insertOne({
      title: data.title,
      description: data.description,
      tech: Array.isArray(data.tech) ? data.tech : (data.tech as string).split(",").map(t => t.trim()),
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      thumbnail: data.thumbnail || "from-teal-500 to-emerald-600",
      order: Number(data.order),
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create project" };
  }
}

export async function updateProject(id: string, data: {
  title: string;
  description: string;
  tech: string | string[];
  githubUrl: string;
  liveUrl: string;
  thumbnail: string;
  order: number;
}) {
  try {
    await checkAdmin();
    const db = await getDb();
    const pId = new ObjectId(id);

    await db.collection("projects").updateOne(
      { _id: pId },
      {
        $set: {
          title: data.title,
          description: data.description,
          tech: Array.isArray(data.tech) ? data.tech : (data.tech as string).split(",").map(t => t.trim()),
          githubUrl: data.githubUrl,
          liveUrl: data.liveUrl,
          thumbnail: data.thumbnail,
          order: Number(data.order),
          updatedAt: new Date()
        }
      }
    );

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update project" };
  }
}

export async function deleteProject(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const pId = new ObjectId(id);

    await db.collection("projects").deleteOne({ _id: pId });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete project" };
  }
}

// ==========================================
// 5. CMS PRESS ACTIONS
// ==========================================

export async function createPress(data: {
  outlet: string;
  text: string;
  link: string;
}) {
  try {
    await checkAdmin();
    const db = await getDb();

    await db.collection("press").insertOne({
      outlet: data.outlet,
      text: data.text,
      link: data.link,
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create press mention" };
  }
}

export async function updatePress(id: string, data: {
  outlet: string;
  text: string;
  link: string;
}) {
  try {
    await checkAdmin();
    const db = await getDb();
    const pressId = new ObjectId(id);

    await db.collection("press").updateOne(
      { _id: pressId },
      {
        $set: {
          outlet: data.outlet,
          text: data.text,
          link: data.link,
          updatedAt: new Date()
        }
      }
    );

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update press mention" };
  }
}

export async function deletePress(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const pressId = new ObjectId(id);

    await db.collection("press").deleteOne({ _id: pressId });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete press mention" };
  }
}

// ==========================================
// 6. GLOBAL SETTINGS ACTION
// ==========================================

export async function updateGlobalSettings(data: {
  headline: string;
  tagline: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  instagram: string;
  youtubeCollegeWallah: string;
  youtubeLearnyard: string;
  youtubePersonal: string;
  whatsappLink: string;
  showWhatsappBanner: boolean;
  mentorshipLink: string;
}) {
  try {
    await checkAdmin();
    const db = await getDb();

    await db.collection("settings").updateOne(
      { _id: "global" as any },
      {
        $set: {
          headline: data.headline,
          tagline: data.tagline,
          bio: data.bio,
          email: data.email,
          github: data.github,
          linkedin: data.linkedin,
          instagram: data.instagram,
          youtubeCollegeWallah: data.youtubeCollegeWallah,
          youtubeLearnyard: data.youtubeLearnyard,
          youtubePersonal: data.youtubePersonal,
          whatsappLink: data.whatsappLink,
          showWhatsappBanner: Boolean(data.showWhatsappBanner),
          mentorshipLink: data.mentorshipLink,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/masterclass");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update global settings" };
  }
}

// ==========================================
// 7. STUDENT 1:1 MENTORSHIP ACTIONS
// ==========================================

export async function bookMentorship(data: {
  topic: string;
  description: string;
  preferredDate: string;
}) {
  try {
    const session = await checkUser();
    const db = await getDb();

    await db.collection("mentorship_bookings").insertOne({
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      topic: data.topic,
      description: data.description,
      preferredDate: new Date(data.preferredDate),
      status: "pending",
      createdAt: new Date()
    });

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to book 1:1 session" };
  }
}

export async function updateMentorshipStatus(id: string, status: "pending" | "approved" | "completed") {
  try {
    await checkAdmin();
    const db = await getDb();
    const bId = new ObjectId(id);

    await db.collection("mentorship_bookings").updateOne(
      { _id: bId },
      { $set: { status, updatedAt: new Date() } }
    );

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update booking status" };
  }
}

export async function deleteMentorshipBooking(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const bId = new ObjectId(id);

    await db.collection("mentorship_bookings").deleteOne({ _id: bId });

    revalidatePath("/dashboard");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete booking record" };
  }
}

// ==========================================
// 8. KEY STATS CRUD ACTIONS
// ==========================================

export async function createStat(data: {
  label: string;
  value: string;
  sub: string;
  order: number;
}) {
  try {
    await checkAdmin();
    const db = await getDb();

    await db.collection("stats").insertOne({
      label: data.label,
      value: data.value,
      sub: data.sub,
      order: Number(data.order),
      createdAt: new Date()
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create statistic" };
  }
}

export async function updateStat(id: string, data: {
  label: string;
  value: string;
  sub: string;
  order: number;
}) {
  try {
    await checkAdmin();
    const db = await getDb();
    const sId = new ObjectId(id);

    await db.collection("stats").updateOne(
      { _id: sId },
      {
        $set: {
          label: data.label,
          value: data.value,
          sub: data.sub,
          order: Number(data.order),
          updatedAt: new Date()
        }
      }
    );

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update statistic" };
  }
}

export async function deleteStat(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const sId = new ObjectId(id);

    await db.collection("stats").deleteOne({ _id: sId });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete statistic" };
  }
}

// ==========================================
// 9. STUDENT & COWORKER TESTIMONIAL ACTIONS
// ==========================================

export async function submitTestimonial(data: {
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
}) {
  try {
    const db = await getDb();

    await db.collection("testimonials").insertOne({
      name: data.name,
      role: data.role,
      company: data.company,
      text: data.text,
      rating: Number(data.rating),
      status: "pending",
      createdAt: new Date()
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit testimonial" };
  }
}

export async function approveTestimonial(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const tId = new ObjectId(id);

    await db.collection("testimonials").updateOne(
      { _id: tId },
      { $set: { status: "approved", approvedAt: new Date() } }
    );

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to approve testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const tId = new ObjectId(id);

    await db.collection("testimonials").deleteOne({ _id: tId });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete testimonial" };
  }
}

// ==========================================
// 10. STUDY RESOURCES (NOTES) ACTIONS
// ==========================================

export async function createNote(data: {
  topic: string;
  subject: string;
  link: string;
  order: number;
}) {
  try {
    await checkAdmin();
    const db = await getDb();

    await db.collection("notes").insertOne({
      topic: data.topic,
      subject: data.subject,
      link: data.link,
      order: Number(data.order),
      createdAt: new Date()
    });

    revalidatePath("/notes");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create resource note" };
  }
}

export async function updateNote(id: string, data: {
  topic: string;
  subject: string;
  link: string;
  order: number;
}) {
  try {
    await checkAdmin();
    const db = await getDb();
    const nId = new ObjectId(id);

    await db.collection("notes").updateOne(
      { _id: nId },
      {
        $set: {
          topic: data.topic,
          subject: data.subject,
          link: data.link,
          order: Number(data.order),
          updatedAt: new Date()
        }
      }
    );

    revalidatePath("/notes");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update resource note" };
  }
}

export async function deleteNote(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const nId = new ObjectId(id);

    await db.collection("notes").deleteOne({ _id: nId });

    revalidatePath("/notes");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete resource note" };
  }
}

// ==========================================
// 11. PLAYLIST ACTIONS
// ==========================================

export async function createPlaylist(data: {
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string | string[];
  thumbnail: string;
  youtubeUrl: string;
  channel: "College Wallah" | "Learnyard" | "Adfar Rasheed";
  type?: "playlist" | "podcast";
}) {
  try {
    await checkAdmin();
    const db = await getDb();
    const resolvedThumbnail = await resolveYouTubeThumbnail(data.youtubeUrl);

    await db.collection("playlists").insertOne({
      title: data.title,
      description: data.description,
      level: data.level,
      tags: Array.isArray(data.tags) 
        ? data.tags 
        : (data.tags as string).split(",").map(t => t.trim()).filter(Boolean),
      thumbnail: data.thumbnail || "from-teal-500 to-emerald-600",
      resolvedThumbnail: resolvedThumbnail || undefined,
      youtubeUrl: data.youtubeUrl,
      channel: data.channel,
      type: data.type || "playlist",
      createdAt: new Date()
    });

    revalidatePath("/playlists");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create playlist" };
  }
}

export async function updatePlaylist(id: string, data: {
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string | string[];
  thumbnail: string;
  youtubeUrl: string;
  channel: "College Wallah" | "Learnyard" | "Adfar Rasheed";
  type?: "playlist" | "podcast";
}) {
  try {
    await checkAdmin();
    const db = await getDb();
    const pId = new ObjectId(id);
    const resolvedThumbnail = await resolveYouTubeThumbnail(data.youtubeUrl);

    await db.collection("playlists").updateOne(
      { _id: pId },
      {
        $set: {
          title: data.title,
          description: data.description,
          level: data.level,
          tags: Array.isArray(data.tags) 
            ? data.tags 
            : (data.tags as string).split(",").map(t => t.trim()).filter(Boolean),
          thumbnail: data.thumbnail,
          resolvedThumbnail: resolvedThumbnail || undefined,
          youtubeUrl: data.youtubeUrl,
          channel: data.channel,
          type: data.type || "playlist",
          updatedAt: new Date()
        }
      }
    );

    revalidatePath("/playlists");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update playlist" };
  }
}

export async function deletePlaylist(id: string) {
  try {
    await checkAdmin();
    const db = await getDb();
    const pId = new ObjectId(id);

    await db.collection("playlists").deleteOne({ _id: pId });

    revalidatePath("/playlists");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete playlist" };
  }
}
