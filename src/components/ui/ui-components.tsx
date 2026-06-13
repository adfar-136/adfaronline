"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ==========================================
// 1. BUTTON
// ==========================================
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 text-white hover:opacity-95 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// ==========================================
// 2. CARD
// ==========================================
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// ==========================================
// 3. BADGE
// ==========================================
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: "text-foreground border-border",
        // custom levels/channels
        beginner: "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        intermediate: "border-transparent bg-sky-500/15 text-sky-600 dark:text-sky-400",
        advanced: "border-transparent bg-purple-500/15 text-purple-600 dark:text-purple-400",
        cw: "border-transparent bg-red-500/15 text-red-600 dark:text-red-400",
        ly: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-400",
        ar: "border-transparent bg-teal-500/15 text-teal-600 dark:text-teal-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// ==========================================
// 4. INPUT & TEXTAREA
// ==========================================
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border border-border bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

// ==========================================
// 5. TABLE
// ==========================================
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-xl border border-border">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b border-border bg-muted/40", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// ==========================================
// 6. TABS
// ==========================================
type TabsContextProps = {
  value: string;
  onValueChange: (value: string) => void;
};
const TabsContext = React.createContext<TabsContextProps | null>(null);

const Tabs: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
  }
> = ({ defaultValue, value, onValueChange, children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback(
    (val: string) => {
      setActiveTab(val);
      if (onValueChange) onValueChange(val);
    },
    [onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value: activeTab, onValueChange: handleValueChange }}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground glass",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");
  const isActive = context.value === value;

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "hover:text-foreground/80",
        className
      )}
      onClick={() => context.onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");
  const isActive = context.value === value;

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";

// ==========================================
// 7. DIALOG
// ==========================================
type DialogContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const DialogContext = React.createContext<DialogContextProps | null>(null);

export const Dialog: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ open, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open);
    }
  }, [open]);

  const handleOpenChange = React.useCallback(
    (op: boolean) => {
      setInternalOpen(op);
      if (onOpenChange) onOpenChange(op);
    },
    [onOpenChange]
  );

  return (
    <DialogContext.Provider value={{ open: internalOpen, setOpen: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger: React.FC<{
  asChild?: boolean;
  children: React.ReactNode;
}> = ({ children }) => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogTrigger must be used inside Dialog");

  const child = React.Children.only(children) as React.ReactElement<any>;
  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent) => {
      if (child.props.onClick) child.props.onClick(e);
      context.setOpen(true);
    },
  });
};

export const DialogContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogContent must be used inside Dialog");

  return (
    <AnimatePresence>
      {context.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => context.setOpen(false)}
          />
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "relative z-50 w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl text-foreground glass overflow-hidden",
              className
            )}
          >
            {/* Close Button */}
            <button
              onClick={() => context.setOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition"
              aria-label="Close dialog"
            >
              ✕
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
);

export const DialogDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6",
      className
    )}
    {...props}
  />
);

// ==========================================
// 8. SHEET (MOBILE SIDEBAR)
// ==========================================
type SheetContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const SheetContext = React.createContext<SheetContextProps | null>(null);

export const Sheet: React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}> = ({ open, onOpenChange, children }) => {
  const [internalOpen, setInternalOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) {
      setInternalOpen(open);
    }
  }, [open]);

  const handleOpenChange = React.useCallback(
    (op: boolean) => {
      setInternalOpen(op);
      if (onOpenChange) onOpenChange(op);
    },
    [onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open: internalOpen, setOpen: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

export const SheetTrigger: React.FC<{
  asChild?: boolean;
  children: React.ReactNode;
}> = ({ children }) => {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used inside Sheet");

  const child = React.Children.only(children) as React.ReactElement<any>;
  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent) => {
      if (child.props.onClick) child.props.onClick(e);
      context.setOpen(true);
    },
  });
};

export const SheetContent: React.FC<{
  side?: "left" | "right";
  className?: string;
  children: React.ReactNode;
}> = ({ side = "right", className, children }) => {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("SheetContent must be used inside Sheet");

  const isLeft = side === "left";

  return (
    <AnimatePresence>
      {context.open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => context.setOpen(false)}
          />
          {/* Content Panel */}
          <motion.div
            initial={{ x: isLeft ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isLeft ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
            className={cn(
              "relative z-50 h-full w-3/4 max-w-sm border-l border-border bg-card p-6 shadow-2xl glass flex flex-col justify-between",
              isLeft ? "left-0 mr-auto border-r border-l-0" : "right-0 ml-auto",
              className
            )}
          >
            <button
              onClick={() => context.setOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition"
              aria-label="Close panel"
            >
              ✕
            </button>
            <div className="flex-1 mt-6 overflow-y-auto pr-2">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-left mb-4",
      className
    )}
    {...props}
  />
);

export const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h2
    className={cn(
      "text-lg font-semibold text-foreground",
      className
    )}
    {...props}
  />
);

export const SheetDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

// ==========================================
// 9. DROPDOWN MENU
// ==========================================
type DropdownContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};
const DropdownContext = React.createContext<DropdownContextProps | null>(null);

export const DropdownMenu: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownMenuTrigger: React.FC<{
  asChild?: boolean;
  children: React.ReactNode;
}> = ({ children }) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuTrigger must be inside DropdownMenu");

  const child = React.Children.only(children) as React.ReactElement<any>;
  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent) => {
      if (child.props.onClick) child.props.onClick(e);
      context.setOpen(!context.open);
    },
  });
};

export const DropdownMenuContent: React.FC<{
  className?: string;
  align?: "left" | "right";
  children: React.ReactNode;
}> = ({ className, align = "right", children }) => {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error("DropdownMenuContent must be inside DropdownMenu");

  return (
    <AnimatePresence>
      {context.open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 shadow-lg glass overflow-hidden",
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            className
          )}
        >
          <div className="flex flex-col gap-1" onClick={() => context.setOpen(false)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const DropdownMenuItem: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children, ...props }) => {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center rounded-lg px-2.5 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors outline-none focus-visible:bg-accent",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// ==========================================
// 10. SEPARATOR
// ==========================================
export const Separator: React.FC<{
  className?: string;
  orientation?: "horizontal" | "vertical";
}> = ({ className, orientation = "horizontal" }) => (
  <div
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
  />
);

// ==========================================
// 11. SKELETON
// ==========================================
export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "animate-pulse rounded bg-muted/60 dark:bg-muted/30",
      className
    )}
    {...props}
  />
);

export {
  Button,
  buttonVariants,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Textarea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
};
