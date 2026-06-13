"use client";

import * as React from "react";
import { 
  createMasterclass, 
  updateMasterclass, 
  deleteMasterclass, 
  toggleMasterclassStatus,
  createExperience,
  updateExperience,
  deleteExperience,
  createProject,
  updateProject,
  deleteProject,
  createPress,
  updatePress,
  deletePress,
  updateGlobalSettings,
  updateMentorshipStatus,
  deleteMentorshipBooking,
  createStat,
  updateStat,
  deleteStat,
  approveTestimonial,
  deleteTestimonial,
  createNote,
  updateNote,
  deleteNote,
  createPlaylist,
  updatePlaylist,
  deletePlaylist
} from "@/app/actions";
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  Input, 
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/ui-components";
import { 
  Users, 
  Calendar, 
  Plus, 
  Edit, 
  Trash, 
  Lock, 
  Unlock, 
  Copy, 
  Download, 
  Loader2, 
  ShieldCheck, 
  Eye, 
  TrendingUp,
  Briefcase,
  FolderGit2,
  Newspaper,
  Settings,
  BookOpen,
  Mail,
  CheckCircle,
  Star,
  MessageSquare,
  GraduationCap
} from "lucide-react";
import { Youtube } from "@/components/brand-icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getYouTubeVideoId } from "@/lib/youtube";

interface AdminDashboardClientProps {
  initialMasterclasses: any[];
  initialRegistrations: any[];
  adminEmail: string;
  initialExperiences: any[];
  initialProjects: any[];
  initialPress: any[];
  initialSettings: any;
  initialBookings: any[];
  initialStats: any[];
  initialTestimonials: any[];
  initialNotes: any[];
  initialPlaylists?: any[];
}

export function AdminDashboardClient({
  initialMasterclasses,
  initialRegistrations,
  adminEmail,
  initialExperiences,
  initialProjects,
  initialPress,
  initialSettings,
  initialBookings,
  initialStats,
  initialTestimonials,
  initialNotes,
  initialPlaylists = []
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [activeTab, setActiveTab] = React.useState("masterclasses");

  // ==========================================
  // STATE 1: MASTERCLASSES
  // ==========================================
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [selectedMcId, setSelectedMcId] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [description, setDescription] = React.useState("");
  
  const getNextSundayString = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() + (day === 0 ? 0 : 7 - day);
    const nextSunday = new Date(today.setDate(diff));
    return nextSunday.toISOString().split("T")[0];
  };

  const [date, setDate] = React.useState(getNextSundayString());
  const [time, setTime] = React.useState("11:00 AM IST");
  const [durationMins, setDurationMins] = React.useState(90);
  const [price, setPrice] = React.useState(0);
  const [capacity, setCapacity] = React.useState<string>("");
  const [paymentNote, setPaymentNote] = React.useState("Pay via UPI after registering — details emailed to you");
  const [status, setStatus] = React.useState<"open" | "closed">("open");

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setTopic("");
    setDescription("");
    setDate(getNextSundayString());
    setTime("11:00 AM IST");
    setDurationMins(90);
    setPrice(0);
    setCapacity("");
    setPaymentNote("Pay via UPI after registering — details emailed to you");
    setStatus("open");
  };

  const handleEditClick = (mc: any) => {
    setEditingId(mc._id);
    setTitle(mc.title);
    setTopic(mc.topic);
    setDescription(mc.description);
    setDate(new Date(mc.date).toISOString().split("T")[0]);
    setTime(mc.time);
    setDurationMins(mc.durationMins);
    setPrice(mc.price);
    setCapacity(mc.capacity !== null ? String(mc.capacity) : "");
    setPaymentNote(mc.paymentNote);
    setStatus(mc.status);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMasterclassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !topic || !description || !date || !time || !paymentNote) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      title,
      topic,
      description,
      date,
      time,
      durationMins: Number(durationMins),
      price: Number(price),
      capacity: capacity === "" ? null : Number(capacity),
      paymentNote,
      status
    };

    startTransition(async () => {
      let res;
      if (editingId) {
        res = await updateMasterclass(editingId, payload);
      } else {
        res = await createMasterclass(payload);
      }

      if (res.success) {
        toast.success(editingId ? "Masterclass updated!" : "Masterclass announced!");
        resetForm();
        router.refresh();
      } else {
        toast.error(res.error || "Operation failed");
      }
    });
  };

  const handleToggleStatus = (id: string, currentStatus: "open" | "closed") => {
    const nextStatus = currentStatus === "open" ? "closed" : "open";
    startTransition(async () => {
      const res = await toggleMasterclassStatus(id, nextStatus);
      if (res.success) {
        toast.success(`Status updated to ${nextStatus}`);
        router.refresh();
      } else {
        toast.error(res.error || "Toggle failed");
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This deletes all registrant records permanently.`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteMasterclass(id);
      if (res.success) {
        toast.success("Masterclass deleted successfully");
        if (selectedMcId === id) setSelectedMcId(null);
        router.refresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    });
  };

  const totalStudentsAllTime = React.useMemo(() => {
    const emails = new Set(initialRegistrations.map((r) => r.userEmail));
    return emails.size;
  }, [initialRegistrations]);

  const weeklyRegistrations = React.useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return initialRegistrations.filter((r) => new Date(r.createdAt) >= sevenDaysAgo).length;
  }, [initialRegistrations]);

  const selectedMc = initialMasterclasses.find((m) => m._id === selectedMcId);
  const registrantsForSelected = React.useMemo(() => {
    if (!selectedMcId) return [];
    return initialRegistrations.filter((r) => r.masterclassId === selectedMcId);
  }, [selectedMcId, initialRegistrations]);

  const handleCopyEmails = () => {
    if (registrantsForSelected.length === 0) return;
    const emails = registrantsForSelected.map((r) => r.userEmail).join(", ");
    navigator.clipboard.writeText(emails);
    toast.success("Roster email list copied!");
  };

  const handleExportCSV = () => {
    if (registrantsForSelected.length === 0 || !selectedMc) return;
    const headers = ["Name", "Email", "Registered At"];
    const rows = registrantsForSelected.map((r) => [
      r.userName,
      r.userEmail,
      new Date(r.createdAt).toLocaleString("en-IN")
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registrants-${selectedMc.title.replace(/\s+/g, "_")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV download started!");
  };


  // ==========================================
  // STATE 2: 1:1 MENTORSHIPS
  // ==========================================
  const handleBookingStatus = (id: string, nextStatus: "pending" | "approved" | "completed") => {
    startTransition(async () => {
      const res = await updateMentorshipStatus(id, nextStatus);
      if (res.success) {
        toast.success(`Mentorship status updated to ${nextStatus}!`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    });
  };

  const handleBookingDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this booking request?")) return;
    startTransition(async () => {
      const res = await deleteMentorshipBooking(id);
      if (res.success) {
        toast.success("Booking deleted successfully.");
        router.refresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    });
  };

  // ==========================================
  // STATE 3: EXPERIENCE TIMELINE
  // ==========================================
  const [expCompany, setExpCompany] = React.useState("");
  const [expRole, setExpRole] = React.useState("");
  const [expPeriod, setExpPeriod] = React.useState("");
  const [expDescription, setExpDescription] = React.useState("");
  const [expOrder, setExpOrder] = React.useState(1);
  const [editingExpId, setEditingExpId] = React.useState<string | null>(null);

  const resetExpForm = () => {
    setExpCompany("");
    setExpRole("");
    setExpPeriod("");
    setExpDescription("");
    setExpOrder(1);
    setEditingExpId(null);
  };

  const handleExpEditClick = (exp: any) => {
    setEditingExpId(exp._id);
    setExpCompany(exp.company);
    setExpRole(exp.role);
    setExpPeriod(exp.period);
    setExpDescription(exp.description);
    setExpOrder(exp.order);
  };

  const handleExpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCompany || !expRole || !expPeriod || !expDescription) {
      toast.error("Please fill in all experience fields");
      return;
    }
    startTransition(async () => {
      let res;
      const payload = {
        company: expCompany,
        role: expRole,
        period: expPeriod,
        description: expDescription,
        order: Number(expOrder)
      };
      if (editingExpId) {
        res = await updateExperience(editingExpId, payload);
      } else {
        res = await createExperience(payload);
      }
      if (res.success) {
        toast.success(editingExpId ? "Experience updated!" : "Experience added!");
        resetExpForm();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save experience");
      }
    });
  };

  const handleExpDelete = (id: string, comp: string) => {
    if (!confirm(`Are you sure you want to delete the experience at "${comp}"?`)) return;
    startTransition(async () => {
      const res = await deleteExperience(id);
      if (res.success) {
        toast.success("Experience deleted!");
        router.refresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    });
  };


  // ==========================================
  // STATE 4: PROJECTS PORTFOLIO
  // ==========================================
  const [projTitle, setProjTitle] = React.useState("");
  const [projDescription, setProjDescription] = React.useState("");
  const [projTech, setProjTech] = React.useState("");
  const [projGithubUrl, setProjGithubUrl] = React.useState("");
  const [projLiveUrl, setProjLiveUrl] = React.useState("");
  const [projThumbnail, setProjThumbnail] = React.useState("from-teal-500 to-emerald-600");
  const [projOrder, setProjOrder] = React.useState(1);
  const [editingProjId, setEditingProjId] = React.useState<string | null>(null);

  const resetProjForm = () => {
    setProjTitle("");
    setProjDescription("");
    setProjTech("");
    setProjGithubUrl("");
    setProjLiveUrl("");
    setProjThumbnail("from-teal-500 to-emerald-600");
    setProjOrder(1);
    setEditingProjId(null);
  };

  const handleProjEditClick = (p: any) => {
    setEditingProjId(p._id);
    setProjTitle(p.title);
    setProjDescription(p.description);
    setProjTech(Array.isArray(p.tech) ? p.tech.join(", ") : p.tech);
    setProjGithubUrl(p.githubUrl === "#" ? "" : p.githubUrl);
    setProjLiveUrl(p.liveUrl === "#" ? "" : p.liveUrl);
    setProjThumbnail(p.thumbnail || "from-teal-500 to-emerald-600");
    setProjOrder(p.order || 1);
  };

  const handleProjSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDescription || !projTech) {
      toast.error("Please fill in all required project fields");
      return;
    }
    startTransition(async () => {
      let res;
      const payload = {
        title: projTitle,
        description: projDescription,
        tech: projTech,
        githubUrl: projGithubUrl || "#",
        liveUrl: projLiveUrl || "#",
        thumbnail: projThumbnail,
        order: Number(projOrder)
      };
      if (editingProjId) {
        res = await updateProject(editingProjId, payload);
      } else {
        res = await createProject(payload);
      }
      if (res.success) {
        toast.success(editingProjId ? "Project updated!" : "Project added!");
        resetProjForm();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save project");
      }
    });
  };

  const handleProjDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete project "${title}"?`)) return;
    startTransition(async () => {
      const res = await deleteProject(id);
      if (res.success) {
        toast.success("Project deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    });
  };


  // ==========================================
  // STATE 5: PRESS MENTIONS
  // ==========================================
  const [pressOutlet, setPressOutlet] = React.useState("");
  const [pressText, setPressText] = React.useState("");
  const [pressLink, setPressLink] = React.useState("");
  const [editingPressId, setEditingPressId] = React.useState<string | null>(null);

  const resetPressForm = () => {
    setPressOutlet("");
    setPressText("");
    setPressLink("");
    setEditingPressId(null);
  };

  const handlePressEditClick = (pr: any) => {
    setEditingPressId(pr._id);
    setPressOutlet(pr.outlet);
    setPressText(pr.text);
    setPressLink(pr.link);
  };

  const handlePressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pressOutlet || !pressText || !pressLink) {
      toast.error("Please fill in all press fields");
      return;
    }
    startTransition(async () => {
      let res;
      const payload = {
        outlet: pressOutlet,
        text: pressText,
        link: pressLink
      };
      if (editingPressId) {
        res = await updatePress(editingPressId, payload);
      } else {
        res = await createPress(payload);
      }
      if (res.success) {
        toast.success(editingPressId ? "Press mention updated!" : "Press mention added!");
        resetPressForm();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save press mention");
      }
    });
  };

  const handlePressDelete = (id: string, outlet: string) => {
    if (!confirm(`Are you sure you want to delete press mention from "${outlet}"?`)) return;
    startTransition(async () => {
      const res = await deletePress(id);
      if (res.success) {
        toast.success("Press mention deleted!");
        router.refresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    });
  };


  // ==========================================
  // STATE 6: GLOBAL SETTINGS
  // ==========================================
  const [setHeadline, setSetHeadline] = React.useState(initialSettings?.headline || "");
  const [setTagline, setSetTagline] = React.useState(initialSettings?.tagline || "");
  const [setBio, setSetBio] = React.useState(initialSettings?.bio || "");
  const [setEmail, setSetEmail] = React.useState(initialSettings?.email || "");
  const [setGithub, setSetGithub] = React.useState(initialSettings?.github || "");
  const [setLinkedin, setSetLinkedin] = React.useState(initialSettings?.linkedin || "");
  const [setInstagram, setSetInstagram] = React.useState(initialSettings?.instagram || "");
  const [setYoutubeCW, setSetYoutubeCW] = React.useState(initialSettings?.youtubeCollegeWallah || "");
  const [setYoutubeLY, setSetYoutubeLY] = React.useState(initialSettings?.youtubeLearnyard || "");
  const [setYoutubePersonal, setSetYoutubePersonal] = React.useState(initialSettings?.youtubePersonal || "");
  const [setWhatsappLink, setSetWhatsappLink] = React.useState(initialSettings?.whatsappLink || "");
  const [setShowBanner, setSetShowBanner] = React.useState(initialSettings?.showWhatsappBanner ?? true);
  const [setMentorshipLink, setSetMentorshipLink] = React.useState(initialSettings?.mentorshipLink || "");
 
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await updateGlobalSettings({
        headline: setHeadline,
        tagline: setTagline,
        bio: setBio,
        email: setEmail,
        github: setGithub,
        linkedin: setLinkedin,
        instagram: setInstagram,
        youtubeCollegeWallah: setYoutubeCW,
        youtubeLearnyard: setYoutubeLY,
        youtubePersonal: setYoutubePersonal,
        whatsappLink: setWhatsappLink,
        showWhatsappBanner: setShowBanner,
        mentorshipLink: setMentorshipLink,
      });
      if (res.success) {
        toast.success("Global settings updated successfully!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update settings");
      }
    });
  };

  // ==========================================
  // STATE 7: KEY STATS (NUMBERS) CRUD
  // ==========================================
  const [statLabel, setStatLabel] = React.useState("");
  const [statValue, setStatValue] = React.useState("");
  const [statSub, setStatSub] = React.useState("");
  const [statOrder, setStatOrder] = React.useState(1);
  const [editingStatId, setEditingStatId] = React.useState<string | null>(null);

  const resetStatForm = () => {
    setStatLabel("");
    setStatValue("");
    setStatSub("");
    setStatOrder(1);
    setEditingStatId(null);
  };

  const handleStatEditClick = (s: any) => {
    setEditingStatId(s._id);
    setStatLabel(s.label);
    setStatValue(s.value);
    setStatSub(s.sub);
    setStatOrder(s.order);
  };

  const handleStatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statLabel || !statValue || !statSub) {
      toast.error("Please fill in all required stats fields");
      return;
    }
    startTransition(async () => {
      let res;
      const payload = {
        label: statLabel,
        value: statValue,
        sub: statSub,
        order: Number(statOrder)
      };
      if (editingStatId) {
        res = await updateStat(editingStatId, payload);
      } else {
        res = await createStat(payload);
      }
      if (res.success) {
        toast.success(editingStatId ? "Statistic updated!" : "Statistic added!");
        resetStatForm();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save stat");
      }
    });
  };

  const handleStatDelete = (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete metric "${label}"?`)) return;
    startTransition(async () => {
      const res = await deleteStat(id);
      if (res.success) {
        toast.success("Statistic deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    });
  };

  // ==========================================
  // STATE 8: TESTIMONIALS APPROVAL
  // ==========================================
  const handleTestimonialApprove = (id: string) => {
    startTransition(async () => {
      const res = await approveTestimonial(id);
      if (res.success) {
        toast.success("Testimonial approved & published on homepage!");
        router.refresh();
      } else {
        toast.error(res.error || "Approval failed");
      }
    });
  };

  const handleTestimonialDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    startTransition(async () => {
      const res = await deleteTestimonial(id);
      if (res.success) {
        toast.success("Testimonial deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    });
  };

  // ==========================================
  // STATE 9: STUDY RESOURCES (NOTES) CRUD
  // ==========================================
  const [noteTopic, setNoteTopic] = React.useState("");
  const [noteSubject, setNoteSubject] = React.useState("Full Stack");
  const [noteLink, setNoteLink] = React.useState("");
  const [noteOrder, setNoteOrder] = React.useState(1);
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null);

  const resetNoteForm = () => {
    setNoteTopic("");
    setNoteSubject("Full Stack");
    setNoteLink("");
    setNoteOrder(1);
    setEditingNoteId(null);
  };

  const handleNoteEditClick = (n: any) => {
    setEditingNoteId(n._id);
    setNoteTopic(n.topic);
    setNoteSubject(n.subject || "Full Stack");
    setNoteLink(n.link);
    setNoteOrder(n.order || 1);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTopic || !noteSubject || !noteLink) {
      toast.error("Please fill in all required notes fields");
      return;
    }
    startTransition(async () => {
      let res;
      const payload = {
        topic: noteTopic,
        subject: noteSubject,
        link: noteLink,
        order: Number(noteOrder)
      };
      if (editingNoteId) {
        res = await updateNote(editingNoteId, payload);
      } else {
        res = await createNote(payload);
      }
      if (res.success) {
        toast.success(editingNoteId ? "Lecture resource updated!" : "Lecture resource added!");
        resetNoteForm();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save lecture resource");
      }
    });
  };

  const handleNoteDelete = (id: string, topic: string) => {
    if (!confirm(`Are you sure you want to delete lecture resource "${topic}"?`)) return;
    startTransition(async () => {
      const res = await deleteNote(id);
      if (res.success) {
        toast.success("Lecture resource deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    });
  };

  // ==========================================
  // STATE 10: PLAYLISTS CRUD
  // ==========================================
  const [playlistTitle, setPlaylistTitle] = React.useState("");
  const [playlistDescription, setPlaylistDescription] = React.useState("");
  const [playlistLevel, setPlaylistLevel] = React.useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [playlistTags, setPlaylistTags] = React.useState("");
  const [playlistThumbnail, setPlaylistThumbnail] = React.useState("from-teal-500 to-emerald-600");
  const [playlistYoutubeUrl, setPlaylistYoutubeUrl] = React.useState("");
  const [playlistChannel, setPlaylistChannel] = React.useState<"College Wallah" | "Learnyard" | "Adfar Rasheed">("College Wallah");
  const [playlistType, setPlaylistType] = React.useState<"playlist" | "podcast">("playlist");
  const [editingPlaylistId, setEditingPlaylistId] = React.useState<string | null>(null);

  const resetPlaylistForm = () => {
    setPlaylistTitle("");
    setPlaylistDescription("");
    setPlaylistLevel("Beginner");
    setPlaylistTags("");
    setPlaylistThumbnail("from-teal-500 to-emerald-600");
    setPlaylistYoutubeUrl("");
    setPlaylistChannel("College Wallah");
    setPlaylistType("playlist");
    setEditingPlaylistId(null);
  };

  const handlePlaylistEditClick = (p: any) => {
    setEditingPlaylistId(p._id);
    setPlaylistTitle(p.title);
    setPlaylistDescription(p.description);
    setPlaylistLevel(p.level || "Beginner");
    setPlaylistTags(Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "");
    setPlaylistThumbnail(p.thumbnail || "from-teal-500 to-emerald-600");
    setPlaylistYoutubeUrl(p.youtubeUrl);
    setPlaylistChannel(p.channel || "College Wallah");
    setPlaylistType(p.type || "playlist");
  };

  const handlePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistTitle || !playlistDescription || !playlistYoutubeUrl) {
      toast.error("Please fill in all required playlist fields");
      return;
    }
    startTransition(async () => {
      let res;
      const payload = {
        title: playlistTitle,
        description: playlistDescription,
        level: playlistLevel,
        tags: playlistTags.split(",").map(t => t.trim()).filter(Boolean),
        thumbnail: playlistThumbnail,
        youtubeUrl: playlistYoutubeUrl,
        channel: playlistChannel,
        type: playlistType
      };
      if (editingPlaylistId) {
        res = await updatePlaylist(editingPlaylistId, payload);
      } else {
        res = await createPlaylist(payload);
      }
      if (res.success) {
        toast.success(editingPlaylistId ? "Playlist updated!" : "Playlist added!");
        resetPlaylistForm();
        router.refresh();
      } else {
        toast.error(res.error || "Failed to save playlist");
      }
    });
  };

  const handlePlaylistDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete playlist "${title}"?`)) return;
    startTransition(async () => {
      const res = await deletePlaylist(id);
      if (res.success) {
        toast.success("Playlist deleted successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* 1. STATS SHIELD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass relative overflow-hidden p-5 border-border/80">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Masterclasses</p>
              <h3 className="text-2xl font-extrabold tracking-tight">{initialMasterclasses.length}</h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg">
              <Calendar className="h-4.5 w-4.5" />
            </div>
          </div>
        </Card>

        <Card className="glass relative overflow-hidden p-5 border-border/80">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Weekly Regs (7d)</p>
              <h3 className="text-2xl font-extrabold tracking-tight text-teal-500">{weeklyRegistrations}</h3>
            </div>
            <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-500 rounded-lg">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>
        </Card>

        <Card className="glass relative overflow-hidden p-5 border-border/80">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">1:1 Bookings</p>
              <h3 className="text-2xl font-extrabold tracking-tight text-purple-500">
                {initialBookings.filter(b => b.status === "pending").length} Pending
              </h3>
            </div>
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 rounded-lg">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
        </Card>

        <Card className="glass relative overflow-hidden p-5 border-border/80">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pending Testimonials</p>
              <h3 className="text-2xl font-extrabold tracking-tight text-emerald-500">
                {initialTestimonials.filter(t => t.status === "pending").length} Pending
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg">
              <MessageSquare className="h-4.5 w-4.5" />
            </div>
          </div>
        </Card>
      </div>

      {/* 2. MAIN CONSOLE NAVIGATION TABS */}
      <Tabs defaultValue="masterclasses" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap w-full justify-start h-auto gap-1 bg-muted/60 p-1 rounded-xl mb-6 overflow-x-auto">
          <TabsTrigger value="masterclasses" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <BookOpen className="h-3.5 w-3.5" />
            Masterclasses
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <Users className="h-3.5 w-3.5" />
            1:1 Mentorships
            {initialBookings.filter(b => b.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 h-4 text-[9px] min-w-4 flex items-center justify-center font-bold">
                {initialBookings.filter(b => b.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <Briefcase className="h-3.5 w-3.5" />
            Timeline Experience
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <FolderGit2 className="h-3.5 w-3.5" />
            Projects Portfolio
          </TabsTrigger>
          <TabsTrigger value="press" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <Newspaper className="h-3.5 w-3.5" />
            Press releases
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            Key Stats
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <MessageSquare className="h-3.5 w-3.5" />
            Testimonials
            {initialTestimonials.filter(t => t.status === "pending").length > 0 && (
              <Badge variant="destructive" className="ml-1 px-1.5 py-0 h-4 text-[9px] min-w-4 flex items-center justify-center font-bold">
                {initialTestimonials.filter(t => t.status === "pending").length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <GraduationCap className="h-3.5 w-3.5" />
            Study Resources
          </TabsTrigger>
          <TabsTrigger value="playlists" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <Youtube className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            YouTube Playlists
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold">
            <Settings className="h-3.5 w-3.5" />
            System Settings
          </TabsTrigger>
        </TabsList>

        {/* ==========================================
            TAB 1: MASTERCLASSES CONSOLE
            ========================================== */}
        <TabsContent value="masterclasses">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-primary" />
                    {editingId ? "Edit Masterclass" : "Create Masterclass"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Define the curriculum details and schedules for college learners.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleMasterclassSubmit}>
                  <CardContent className="p-6 pt-0 space-y-4 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 space-y-1">
                        <label className="font-semibold text-muted-foreground">Masterclass Title *</label>
                        <Input
                          type="text"
                          placeholder="Next.js App Router Mastery"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="h-9 text-xs"
                        />
                      </div>
                      
                      <div className="col-span-2 space-y-1">
                        <label className="font-semibold text-muted-foreground">Focused Topic *</label>
                        <Input
                          type="text"
                          placeholder="Server Components, Server Actions & Better Auth"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          required
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="col-span-2 space-y-1">
                        <label className="font-semibold text-muted-foreground">Curriculum Description *</label>
                        <Textarea
                          placeholder="Provide a detailed roadmap/outline of what will be built..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[90px] text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Date (Sunday) *</label>
                        <Input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Time (e.g. 11:00 AM IST) *</label>
                        <Input
                          type="text"
                          placeholder="11:00 AM IST"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Duration (Mins) *</label>
                        <Input
                          type="number"
                          value={durationMins}
                          onChange={(e) => setDurationMins(Number(e.target.value))}
                          required
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Price (₹, 0 = Free) *</label>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                          required
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-muted-foreground">Seat Cap (Optional)</label>
                        <Input
                          type="number"
                          placeholder="Unlimited"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1 flex flex-col justify-end">
                        <label className="font-semibold text-muted-foreground mb-1">Registrations Status</label>
                        <div className="flex gap-1.5 h-9 items-center">
                          <Button
                            type="button"
                            variant={status === "open" ? "default" : "outline"}
                            onClick={() => setStatus("open")}
                            className="flex-1 text-[10px] h-full rounded-lg"
                          >
                            Open
                          </Button>
                          <Button
                            type="button"
                            variant={status === "closed" ? "default" : "outline"}
                            onClick={() => setStatus("closed")}
                            className="flex-1 text-[10px] h-full rounded-lg"
                          >
                            Closed
                          </Button>
                        </div>
                      </div>

                      <div className="col-span-2 space-y-1">
                        <label className="font-semibold text-muted-foreground">Payment Instructions *</label>
                        <Input
                          type="text"
                          placeholder="UPI/QR billing instructions..."
                          value={paymentNote}
                          onChange={(e) => setPaymentNote(e.target.value)}
                          required
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </CardContent>

                  <Separator className="opacity-40" />

                  <CardFooter className="p-6 flex items-center justify-between gap-3">
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="flex-1 text-xs h-9 rounded-lg"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 text-xs h-9 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg"
                    >
                      {isPending ? (
                        <span className="flex items-center justify-center gap-1">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Saving...
                        </span>
                      ) : editingId ? (
                        "Update Announcement"
                      ) : (
                        "Publish Announcement"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold">Announced Masterclasses</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Manage weekly schedules, toggle booking status, and view active lists.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {initialMasterclasses.length === 0 ? (
                    <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                      No classes published yet.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-bold">Class Details</TableHead>
                          <TableHead className="text-xs font-bold text-center">Status</TableHead>
                          <TableHead className="text-xs font-bold text-center">Seats Booked</TableHead>
                          <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {initialMasterclasses.map((mc) => {
                          const count = initialRegistrations.filter((r) => r.masterclassId === mc._id).length;
                          const formattedDate = new Date(mc.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short"
                          });

                          const isSelected = selectedMcId === mc._id;

                          return (
                            <TableRow key={mc._id} className={isSelected ? "bg-muted/40" : ""}>
                              <TableCell className="max-w-[150px]">
                                <p className="font-bold text-xs truncate leading-snug">{mc.title}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {formattedDate} · {mc.time}
                                </p>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant={mc.status === "open" ? "intermediate" : "destructive"} className="text-[9px] font-bold">
                                  {mc.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center text-xs font-semibold text-foreground">
                                {count} {mc.capacity ? `/ ${mc.capacity}` : ""}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setSelectedMcId(isSelected ? null : mc._id)}
                                    className={`h-8 w-8 rounded-lg ${isSelected ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                                    title="View Roster"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleToggleStatus(mc._id, mc.status)}
                                    className="h-8 w-8 rounded-lg text-muted-foreground"
                                    title={mc.status === "open" ? "Close registrations" : "Open registrations"}
                                  >
                                    {mc.status === "open" ? (
                                      <Lock className="h-3.5 w-3.5 text-amber-500" />
                                    ) : (
                                      <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                                    )}
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleEditClick(mc)}
                                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                                    title="Edit"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleDelete(mc._id, mc.title)}
                                    className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                    title="Delete"
                                  >
                                    <Trash className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Roster list */}
          {selectedMcId && selectedMc && (
            <Card className="glass border-border/80 mt-8">
              <CardHeader className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Registrants Directory</span>
                  <CardTitle className="text-base font-bold">
                    Student Roster: {selectedMc.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Currently tracking {registrantsForSelected.length} active registration seats.
                  </CardDescription>
                </div>
                
                {registrantsForSelected.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyEmails}
                      className="gap-1.5 text-xs rounded-lg h-8 glass"
                    >
                      <Copy className="h-3.5 w-3.5 text-teal-500" />
                      Copy Emails
                    </Button>
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={handleExportCSV}
                      className="gap-1.5 text-xs rounded-lg h-8 text-white font-semibold"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export CSV
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {registrantsForSelected.length === 0 ? (
                  <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                    No students registered for this class yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-bold">Student Name</TableHead>
                        <TableHead className="text-xs font-bold">Email Address</TableHead>
                        <TableHead className="text-xs font-bold text-right">Registered On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registrantsForSelected.map((reg) => (
                        <TableRow key={reg._id}>
                          <TableCell className="font-bold text-xs">{reg.userName}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{reg.userEmail}</TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {new Date(reg.createdAt).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ==========================================
            TAB 2: 1:1 MENTORSHIPS BOOKINGS
            ========================================== */}
        <TabsContent value="bookings">
          <Card className="glass border-border/80">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-bold flex items-center gap-1.5">
                <Users className="h-4.5 w-4.5 text-primary" />
                1:1 Mentorship Booking Requests
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Review submitted requests from registered students, schedule dates, and track completion statuses.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {initialBookings.length === 0 ? (
                <div className="text-center p-12 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                  No mentorship requests received yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-bold">Student Details</TableHead>
                      <TableHead className="text-xs font-bold">Booking Topic</TableHead>
                      <TableHead className="text-xs font-bold">Preferred Date</TableHead>
                      <TableHead className="text-xs font-bold text-center">Status</TableHead>
                      <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialBookings.map((booking) => {
                      const datePref = new Date(booking.preferredDate).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      });
                      return (
                        <TableRow key={booking._id}>
                          <TableCell>
                            <p className="font-bold text-xs text-foreground">{booking.userName}</p>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                              {booking.userEmail}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <p className="text-xs font-semibold text-foreground">{booking.topic}</p>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5" title={booking.description}>
                              {booking.description}
                            </p>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {datePref}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                booking.status === "completed" 
                                  ? "beginner" 
                                  : booking.status === "approved" 
                                  ? "intermediate" 
                                  : "outline"
                              }
                              className="text-[9px] font-bold"
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {booking.status === "pending" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBookingStatus(booking._id, "approved")}
                                  className="h-8 text-[10px] rounded-lg border-emerald-500/25 text-emerald-500 hover:bg-emerald-500/10"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Approve
                                </Button>
                              )}
                              {booking.status === "approved" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBookingStatus(booking._id, "completed")}
                                  className="h-8 text-[10px] rounded-lg border-purple-500/25 text-purple-500 hover:bg-purple-500/10"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Complete
                                </Button>
                              )}
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleBookingDelete(booking._id)}
                                className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                title="Delete Booking"
                              >
                                <Trash className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==========================================
            TAB 3: TIMELINE EXPERIENCE
            ========================================== */}
        <TabsContent value="experience">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold flex items-center gap-1.5">
                    <Briefcase className="h-4.5 w-4.5 text-primary" />
                    {editingExpId ? "Edit Experience" : "Add Experience Node"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Define work nodes dynamically displayed on the homepage timeline.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleExpSubmit}>
                  <CardContent className="p-6 pt-0 space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Company Name *</label>
                      <Input
                        type="text"
                        placeholder="PW Skills (Physics Wallah)"
                        value={expCompany}
                        onChange={(e) => setExpCompany(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Job Role *</label>
                      <Input
                        type="text"
                        placeholder="Professor & Program Director"
                        value={expRole}
                        onChange={(e) => setExpRole(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Period *</label>
                      <Input
                        type="text"
                        placeholder="Jan 2025–Present"
                        value={expPeriod}
                        onChange={(e) => setExpPeriod(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Description Outline *</label>
                      <Textarea
                        placeholder="Detail FSD curriculum owners, Batches trained, workshops delivered..."
                        value={expDescription}
                        onChange={(e) => setExpDescription(e.target.value)}
                        className="min-h-[100px] text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Sort Order (lower = higher priority) *</label>
                      <Input
                        type="number"
                        value={expOrder}
                        onChange={(e) => setExpOrder(Number(e.target.value))}
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                  </CardContent>
                  <Separator className="opacity-45" />
                  <CardFooter className="p-6 flex items-center justify-between gap-3">
                    {editingExpId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetExpForm}
                        className="flex-1 text-xs h-9 rounded-lg"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 text-xs h-9 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg"
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : editingExpId ? (
                        "Update Node"
                      ) : (
                        "Add Experience"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold">Timeline Nodes</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Active professional history, ordered ascending.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {initialExperiences.length === 0 ? (
                    <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                      No experiences recorded yet.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-bold">Position</TableHead>
                          <TableHead className="text-xs font-bold">Period</TableHead>
                          <TableHead className="text-xs font-bold text-center">Order</TableHead>
                          <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {initialExperiences.map((exp) => (
                          <TableRow key={exp._id} className={editingExpId === exp._id ? "bg-muted/40" : ""}>
                            <TableCell>
                              <p className="font-bold text-xs text-foreground">{exp.role}</p>
                              <span className="text-[10px] text-muted-foreground">{exp.company}</span>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {exp.period}
                            </TableCell>
                            <TableCell className="text-center text-xs font-semibold text-foreground">
                              {exp.order}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleExpEditClick(exp)}
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                                  title="Edit Node"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleExpDelete(exp._id, exp.company)}
                                  className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                  title="Delete Node"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==========================================
            TAB 4: PROJECTS PORTFOLIO
            ========================================== */}
        <TabsContent value="projects">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold flex items-center gap-1.5">
                    <FolderGit2 className="h-4.5 w-4.5 text-primary" />
                    {editingProjId ? "Edit Project" : "Add Portfolio Project"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Display dynamic web applications to highlight development credentials.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleProjSubmit}>
                  <CardContent className="p-6 pt-0 space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Project Title *</label>
                      <Input
                        type="text"
                        placeholder="DevFlow Q&A Forum"
                        value={projTitle}
                        onChange={(e) => setProjTitle(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Detailed Description *</label>
                      <Textarea
                        placeholder="Detail client-server architecture, features built, libraries implemented..."
                        value={projDescription}
                        onChange={(e) => setProjDescription(e.target.value)}
                        className="min-h-[90px] text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Tech Stack (comma-separated) *</label>
                      <Input
                        type="text"
                        placeholder="Next.js, Tailwind CSS, MongoDB, OpenAI"
                        value={projTech}
                        onChange={(e) => setProjTech(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">GitHub URL</label>
                        <Input
                          type="text"
                          placeholder="https://github.com/..."
                          value={projGithubUrl}
                          onChange={(e) => setProjGithubUrl(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Live Demo URL</label>
                        <Input
                          type="text"
                          placeholder="https://devflow.vercel.app"
                          value={projLiveUrl}
                          onChange={(e) => setProjLiveUrl(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Card Thumbnail Gradient</label>
                        <select
                          value={projThumbnail}
                          onChange={(e) => setProjThumbnail(e.target.value)}
                          className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="from-teal-500 to-emerald-600">Teal &rarr; Emerald</option>
                          <option value="from-blue-600 to-indigo-600">Blue &rarr; Indigo</option>
                          <option value="from-purple-600 to-pink-600">Purple &rarr; Pink</option>
                          <option value="from-amber-500 to-orange-600">Amber &rarr; Orange</option>
                          <option value="from-rose-500 to-red-600">Rose &rarr; Red</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Sort Order *</label>
                        <Input
                          type="number"
                          value={projOrder}
                          onChange={(e) => setProjOrder(Number(e.target.value))}
                          required
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <Separator className="opacity-45" />
                  <CardFooter className="p-6 flex items-center justify-between gap-3">
                    {editingProjId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetProjForm}
                        className="flex-1 text-xs h-9 rounded-lg"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 text-xs h-9 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg"
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : editingProjId ? (
                        "Update Project"
                      ) : (
                        "Add Project"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold">Portfolio Projects</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Active portfolio records displayed in landing grids.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {initialProjects.length === 0 ? (
                    <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                      No projects recorded yet.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-bold">Project</TableHead>
                          <TableHead className="text-xs font-bold">Tech Stack</TableHead>
                          <TableHead className="text-xs font-bold text-center">Order</TableHead>
                          <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {initialProjects.map((p) => (
                          <TableRow key={p._id} className={editingProjId === p._id ? "bg-muted/40" : ""}>
                            <TableCell>
                              <p className="font-bold text-xs text-foreground">{p.title}</p>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[150px] block">
                                {p.description}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[150px]">
                                {(Array.isArray(p.tech) ? p.tech : []).map((t: string, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-[8px] px-1 py-0 rounded">
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-xs font-semibold text-foreground">
                              {p.order}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleProjEditClick(p)}
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                                  title="Edit Project"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleProjDelete(p._id, p.title)}
                                  className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                  title="Delete Project"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==========================================
            TAB 5: PRESS MENTIONS
            ========================================== */}
        <TabsContent value="press">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold flex items-center gap-1.5">
                    <Newspaper className="h-4.5 w-4.5 text-primary" />
                    {editingPressId ? "Edit Press Mention" : "Announce Press Mention"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Record publications, newspapers, or media announcements featuring your work.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePressSubmit}>
                  <CardContent className="p-6 pt-0 space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">News Outlet Name *</label>
                      <Input
                        type="text"
                        placeholder="Business Standard"
                        value={pressOutlet}
                        onChange={(e) => setPressOutlet(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Feature Headline / Text *</label>
                      <Textarea
                        placeholder="Named as FSD faculty launch program in PW offline Skillshala networks..."
                        value={pressText}
                        onChange={(e) => setPressText(e.target.value)}
                        className="min-h-[100px] text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Announcement Article URL *</label>
                      <Input
                        type="url"
                        placeholder="https://www.business-standard.com/..."
                        value={pressLink}
                        onChange={(e) => setPressLink(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                  </CardContent>
                  <Separator className="opacity-45" />
                  <CardFooter className="p-6 flex items-center justify-between gap-3">
                    {editingPressId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetPressForm}
                        className="flex-1 text-xs h-9 rounded-lg"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 text-xs h-9 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg"
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : editingPressId ? (
                        "Update Press"
                      ) : (
                        "Publish Press"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold">News Highlights</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Active press mentions recorded.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {initialPress.length === 0 ? (
                    <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                      No press highlights recorded yet.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-bold">Outlet</TableHead>
                          <TableHead className="text-xs font-bold">Snippet Text</TableHead>
                          <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {initialPress.map((pr) => (
                          <TableRow key={pr._id} className={editingPressId === pr._id ? "bg-muted/40" : ""}>
                            <TableCell className="font-bold text-xs text-foreground">
                              {pr.outlet}
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <p className="text-xs text-muted-foreground line-clamp-2">{pr.text}</p>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handlePressEditClick(pr)}
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                                  title="Edit Press"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handlePressDelete(pr._id, pr.outlet)}
                                  className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                  title="Delete Press"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==========================================
            TAB 6: KEY STATS CRUD
            ========================================== */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold flex items-center gap-1.5">
                    <TrendingUp className="h-4.5 w-4.5 text-primary" />
                    {editingStatId ? "Edit Statistic" : "Add Statistic Metric"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Define dynamic milestones like &ldquo;20000+ Students Mentored&rdquo; shown on your homepage.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleStatSubmit}>
                  <CardContent className="p-6 pt-0 space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Metric Label *</label>
                      <Input
                        type="text"
                        placeholder="Students Mentored"
                        value={statLabel}
                        onChange={(e) => setStatLabel(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Metric Value (Number + symbol) *</label>
                      <Input
                        type="text"
                        placeholder="20000+"
                        value={statValue}
                        onChange={(e) => setStatValue(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Subtext Details *</label>
                      <Input
                        type="text"
                        placeholder="Across 30+ batches"
                        value={statSub}
                        onChange={(e) => setStatSub(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Sort Order *</label>
                      <Input
                        type="number"
                        value={statOrder}
                        onChange={(e) => setStatOrder(Number(e.target.value))}
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                  </CardContent>
                  <Separator className="opacity-45" />
                  <CardFooter className="p-6 flex items-center justify-between gap-3">
                    {editingStatId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetStatForm}
                        className="flex-1 text-xs h-9 rounded-lg"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 text-xs h-9 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg"
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : editingStatId ? (
                        "Update Stat"
                      ) : (
                        "Add Stat"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold">Key Performance Numbers</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Dynamic metrics displayed on hero row, ordered ascending.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {initialStats.length === 0 ? (
                    <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                      No metrics recorded yet.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-bold">Metric</TableHead>
                          <TableHead className="text-xs font-bold text-center">Value</TableHead>
                          <TableHead className="text-xs font-bold text-center">Order</TableHead>
                          <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {initialStats.map((s) => (
                          <TableRow key={s._id} className={editingStatId === s._id ? "bg-muted/40" : ""}>
                            <TableCell>
                              <p className="font-bold text-xs text-foreground">{s.label}</p>
                              <span className="text-[10px] text-muted-foreground">{s.sub}</span>
                            </TableCell>
                            <TableCell className="text-center text-xs font-extrabold text-teal-500">
                              {s.value}
                            </TableCell>
                            <TableCell className="text-center text-xs font-semibold text-foreground">
                              {s.order}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleStatEditClick(s)}
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                                  title="Edit Stat"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleStatDelete(s._id, s.label)}
                                  className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                  title="Delete Stat"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==========================================
            TAB 7: TESTIMONIALS APPROVAL CONSOLE
            ========================================== */}
        <TabsContent value="testimonials">
          <Card className="glass border-border/80">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-bold flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-primary" />
                Student & Coworker Testimonials
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Approve public reviews left by students or coworkers before showing them on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {initialTestimonials.length === 0 ? (
                <div className="text-center p-12 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                  No testimonials submitted yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs font-bold">Author</TableHead>
                      <TableHead className="text-xs font-bold">Review Comment</TableHead>
                      <TableHead className="text-xs font-bold text-center">Rating</TableHead>
                      <TableHead className="text-xs font-bold text-center">Status</TableHead>
                      <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialTestimonials.map((t) => (
                      <TableRow key={t._id}>
                        <TableCell>
                          <p className="font-bold text-xs text-foreground">{t.name}</p>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">
                            {t.role} &middot; {t.company}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[280px]">
                          <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-3" title={t.text}>
                            &ldquo;{t.text}&rdquo;
                          </p>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`h-3 w-3 ${idx < t.rating ? "fill-amber-500 text-amber-500" : "text-border"}`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={t.status === "approved" ? "beginner" : "outline"}
                            className="text-[9px] font-bold"
                          >
                            {t.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {t.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleTestimonialApprove(t._id)}
                                className="h-8 text-[10px] rounded-lg border-emerald-500/25 text-emerald-500 hover:bg-emerald-500/10"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleTestimonialDelete(t._id)}
                              className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                              title="Delete Testimonial"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==========================================
            TAB 9: STUDY RESOURCES (NOTES) CONSOLE
            ========================================== */}
        <TabsContent value="resources">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold flex items-center gap-1.5">
                    <GraduationCap className="h-4.5 w-4.5 text-primary" />
                    {editingNoteId ? "Edit Study Resource" : "Add Study Resource"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Define topic-wise class slides, PDF documents, or Google Drive folder links for students.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleNoteSubmit}>
                  <CardContent className="p-6 pt-0 space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Topic Title *</label>
                      <Input
                        type="text"
                        placeholder="Express.js REST API Design"
                        value={noteTopic}
                        onChange={(e) => setNoteTopic(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Subject / Category *</label>
                      <select
                        value={noteSubject}
                        onChange={(e) => setNoteSubject(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="Full Stack">Full Stack</option>
                        <option value="Next.js">Next.js</option>
                        <option value="JavaScript">JavaScript</option>
                        <option value="Databases">Databases</option>
                        <option value="Generative AI">Generative AI</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Google Drive / Cloud Link *</label>
                      <Input
                        type="url"
                        placeholder="https://drive.google.com/drive/folders/..."
                        value={noteLink}
                        onChange={(e) => setNoteLink(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Sort Order (lower = higher priority) *</label>
                      <Input
                        type="number"
                        value={noteOrder}
                        onChange={(e) => setNoteOrder(Number(e.target.value))}
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                  </CardContent>
                  <Separator className="opacity-45" />
                  <CardFooter className="p-6 flex items-center justify-between gap-3">
                    {editingNoteId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetNoteForm}
                        className="flex-1 text-xs h-9 rounded-lg"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 text-xs h-9 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg"
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : editingNoteId ? (
                        "Update Resource"
                      ) : (
                        "Add Resource"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold">Study Resources & Lecture Notes</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Active study resources displayed in landing categories, sorted by subject and order.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {initialNotes.length === 0 ? (
                    <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                      No study resources recorded yet.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-bold">Topic</TableHead>
                          <TableHead className="text-xs font-bold">Subject</TableHead>
                          <TableHead className="text-xs font-bold text-center">Order</TableHead>
                          <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {initialNotes.map((n) => (
                          <TableRow key={n._id} className={editingNoteId === n._id ? "bg-muted/40" : ""}>
                            <TableCell>
                              <p className="font-bold text-xs text-foreground truncate max-w-[160px]">{n.topic}</p>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[160px] block" title={n.link}>
                                {n.link}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 rounded">
                                {n.subject}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center text-xs font-semibold text-foreground">
                              {n.order}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleNoteEditClick(n)}
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                                  title="Edit Resource"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleNoteDelete(n._id, n.topic)}
                                  className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                  title="Delete Resource"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==========================================
            TAB 10: PLAYLISTS CONSOLE
            ========================================== */}
        <TabsContent value="playlists">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold flex items-center gap-1.5">
                    <Youtube className="h-4.5 w-4.5 text-red-500 fill-red-500" />
                    {editingPlaylistId ? "Edit Playlist" : "Add YouTube Playlist"}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Define playlists with channels, descriptions, level classifications, and links.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePlaylistSubmit}>
                  <CardContent className="p-6 pt-0 space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Playlist Title *</label>
                      <Input
                        type="text"
                        placeholder="Full Stack Development (MERN)"
                        value={playlistTitle}
                        onChange={(e) => setPlaylistTitle(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Description *</label>
                      <Textarea
                        placeholder="End-to-end MERN — MongoDB, Express, React, Node — building real apps."
                        value={playlistDescription}
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                        required
                        rows={3}
                        className="text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Type *</label>
                        <select
                          value={playlistType}
                          onChange={(e) => setPlaylistType(e.target.value as any)}
                          className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="playlist">Playlist</option>
                          <option value="podcast">Podcast</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Level *</label>
                        <select
                          value={playlistLevel}
                          onChange={(e) => setPlaylistLevel(e.target.value as any)}
                          className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-muted-foreground">Channel *</label>
                        <select
                          value={playlistChannel}
                          onChange={(e) => setPlaylistChannel(e.target.value as any)}
                          className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="College Wallah">College Wallah</option>
                          <option value="Learnyard">Learnyard</option>
                          <option value="Adfar Rasheed">Adfar Rasheed</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">YouTube Playlist URL *</label>
                      <Input
                        type="text"
                        placeholder="https://www.youtube.com/playlist?list=... (or '#' for Coming Soon)"
                        value={playlistYoutubeUrl}
                        onChange={(e) => setPlaylistYoutubeUrl(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Tags (comma-separated)</label>
                      <Input
                        type="text"
                        placeholder="MERN, React, Node, CSS"
                        value={playlistTags}
                        onChange={(e) => setPlaylistTags(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Thumbnail (Tailwind gradient or URL)</label>
                      <Input
                        type="text"
                        placeholder="from-cyan-500 to-blue-600"
                        value={playlistThumbnail}
                        onChange={(e) => setPlaylistThumbnail(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    {/* Live Preview Block */}
                    <div className="space-y-1.5 pt-2">
                      <label className="font-semibold text-muted-foreground block">Thumbnail Preview</label>
                      {(() => {
                        let previewUrl = "";
                        
                        if (playlistThumbnail && (playlistThumbnail.startsWith("http") || playlistThumbnail.startsWith("/") || playlistThumbnail.includes("."))) {
                          previewUrl = playlistThumbnail;
                        } else if (playlistYoutubeUrl && playlistYoutubeUrl !== "#") {
                          const vId = getYouTubeVideoId(playlistYoutubeUrl);
                          if (vId) {
                            previewUrl = `https://i.ytimg.com/vi/${vId}/hqdefault.jpg`;
                          }
                        }
                        
                        if (previewUrl) {
                          return (
                            <div className="relative h-28 w-full rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
                              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Youtube className="h-6 w-6 text-red-500 fill-red-500" />
                              </div>
                            </div>
                          );
                        } else {
                          // Assume gradient or default fallback
                          const gradClasses = playlistThumbnail || "from-teal-500 to-emerald-600";
                          return (
                            <div className={`h-28 w-full rounded-lg bg-gradient-to-tr ${gradClasses} border border-border flex items-center justify-center text-white relative overflow-hidden`}>
                              <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                              <Youtube className="h-6 w-6 text-white/80" />
                              <span className="absolute bottom-2 left-2 text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-white/90">
                                Gradient Fallback
                              </span>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </CardContent>
                  <Separator className="opacity-45" />
                  <CardFooter className="p-6 flex items-center justify-between gap-3">
                    {editingPlaylistId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetPlaylistForm}
                        className="flex-1 text-xs h-9 rounded-lg"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 text-xs h-9 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg"
                    >
                      {isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : editingPlaylistId ? (
                        "Update Playlist"
                      ) : (
                        "Add Playlist"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card className="glass border-border/80">
                <CardHeader className="p-6">
                  <CardTitle className="text-base font-bold">YouTube Playlists</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Active playlists displayed in resources catalog, sorted by newest created.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  {initialPlaylists.length === 0 ? (
                    <div className="text-center p-8 rounded-xl border border-dashed border-border/80 text-muted-foreground text-xs">
                      No playlists dynamic data stored yet. Displays static defaults.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs font-bold">Playlist</TableHead>
                          <TableHead className="text-xs font-bold">Channel</TableHead>
                          <TableHead className="text-xs font-bold">Level</TableHead>
                          <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {initialPlaylists.map((p) => (
                          <TableRow key={p._id} className={editingPlaylistId === p._id ? "bg-muted/40" : ""}>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <p className="font-bold text-xs text-foreground truncate max-w-[160px]">{p.title}</p>
                                <Badge variant={p.type === "podcast" ? "ar" : "outline"} className="text-[8px] px-1 py-0.5 leading-none h-4">
                                  {p.type === "podcast" ? "Podcast" : "Playlist"}
                                </Badge>
                              </div>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[160px] block" title={p.youtubeUrl}>
                                {p.youtubeUrl}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 rounded">
                                {p.channel}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-foreground">
                              {p.level}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handlePlaylistEditClick(p)}
                                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                                  title="Edit Playlist"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handlePlaylistDelete(p._id, p.title)}
                                  className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                                  title="Delete Playlist"
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ==========================================
            TAB 8: SYSTEM SETTINGS
            ========================================== */}
        <TabsContent value="settings">
          <Card className="glass border-border/80 max-w-3xl mx-auto">
            <CardHeader className="p-6">
              <CardTitle className="text-base font-bold flex items-center gap-1.5">
                <Settings className="h-4.5 w-4.5 text-primary" />
                Global System Settings
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Manage metadata, channels, bio descriptions, social community triggers, and booking paths.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSettingsSubmit}>
              <CardContent className="p-6 pt-0 space-y-4 text-xs">
                
                {/* Section header */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
                    Profile Copy & Metadata
                  </h4>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Headline Headline (Job Title) *</label>
                    <Input
                      type="text"
                      value={setHeadline}
                      onChange={(e) => setSetHeadline(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Tagline Summary *</label>
                    <Input
                      type="text"
                      value={setTagline}
                      onChange={(e) => setSetTagline(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Educator Bio Description *</label>
                    <Textarea
                      value={setBio}
                      onChange={(e) => setSetBio(e.target.value)}
                      required
                      className="min-h-[120px] text-xs leading-relaxed"
                    />
                  </div>
                </div>

                {/* Section header */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
                    Social Links & YouTube Channels
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Contact Email Address *</label>
                      <Input
                        type="email"
                        value={setEmail}
                        onChange={(e) => setSetEmail(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">GitHub Profile URL *</label>
                      <Input
                        type="url"
                        value={setGithub}
                        onChange={(e) => setSetGithub(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">LinkedIn Profile URL *</label>
                      <Input
                        type="url"
                        value={setLinkedin}
                        onChange={(e) => setSetLinkedin(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">Instagram Creator Page *</label>
                      <Input
                        type="url"
                        value={setInstagram}
                        onChange={(e) => setSetInstagram(e.target.value)}
                        required
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">YouTube: College Wallah URL</label>
                      <Input
                        type="url"
                        value={setYoutubeCW}
                        onChange={(e) => setSetYoutubeCW(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">YouTube: Learnyard URL</label>
                      <Input
                        type="url"
                        value={setYoutubeLY}
                        onChange={(e) => setSetYoutubeLY(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-muted-foreground">YouTube: Personal Channel URL</label>
                      <Input
                        type="url"
                        value={setYoutubePersonal}
                        onChange={(e) => setSetYoutubePersonal(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Section header */}
                <div className="space-y-3 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary border-b border-border/60 pb-1">
                    Student Communities & Bookings
                  </h4>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-muted-foreground">Student WhatsApp Invite Link *</label>
                    <Input
                      type="url"
                      value={setWhatsappLink}
                      onChange={(e) => setSetWhatsappLink(e.target.value)}
                      required
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1.5">
                    <input
                      type="checkbox"
                      id="showBanner"
                      checked={setShowBanner}
                      onChange={(e) => setSetShowBanner(e.target.checked)}
                      className="rounded border-border bg-background focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor="showBanner" className="font-bold text-foreground cursor-pointer select-none">
                      Toggle WhatsApp Header Banner Display
                    </label>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="font-semibold text-muted-foreground">
                      External 1:1 Booking Link (Calendly / Cal.com)
                    </label>
                    <Input
                      type="url"
                      placeholder="Leave blank to use internal database booking forms"
                      value={setMentorshipLink}
                      onChange={(e) => setSetMentorshipLink(e.target.value)}
                      className="h-9 text-xs"
                    />
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Note: If filled, the 1:1 book button will route students straight to this URL instead of loading the internal MongoDB application modal.
                    </p>
                  </div>
                </div>

              </CardContent>
              <Separator className="opacity-45" />
              <CardFooter className="p-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto px-8 text-xs h-9 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg"
                >
                  {isPending ? (
                    <span className="flex items-center justify-center gap-1">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving settings...
                    </span>
                  ) : (
                    "Save Global Configuration"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
