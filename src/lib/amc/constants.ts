import type { TaskStatus, TaskType, TaskPriority } from "@/types/amc";

export const COLUMNS: { key: TaskStatus; label: string; color: string; hint: string }[] = [
  { key: "backlog",     label: "Backlog",     color: "rgba(255,255,255,0.2)", hint: "Not started — needs to be picked up" },
  { key: "ready",       label: "Ready",       color: "#6d9eeb", hint: "Specced and ready to start" },
  { key: "in_progress", label: "In Progress", color: "#d56047", hint: "Actively being worked on right now (max 3 at a time)" },
  { key: "review",      label: "Review",      color: "#ae8c41", hint: "Needs a second pair of eyes before scheduling" },
  { key: "scheduled",   label: "Scheduled",   color: "#8cae41", hint: "Approved and slotted for a release date" },
  { key: "published",   label: "Published",   color: "#47ae70", hint: "Live — done" },
  { key: "repurpose",   label: "Repurpose",   color: "#9b6deb", hint: "Published content being reworked into something new" },
];

export const TYPE_COLORS: Record<TaskType, [string, string]> = {
  yt:           ["rgba(213,96,71,0.15)",   "#d56047"],
  infographic:  ["rgba(109,158,235,0.15)", "#6d9eeb"],
  frame_design: ["rgba(174,140,65,0.15)",  "#ae8c41"],
  actual_play:  ["rgba(71,174,112,0.15)",  "#47ae70"],
  community:    ["rgba(155,109,235,0.15)", "#9b6deb"],
  admin:        ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.4)"],
  tech:         ["rgba(140,174,65,0.15)",  "#8cae41"],
};

export const TYPE_LABELS: Record<TaskType, string> = {
  yt: "YT", infographic: "Infographic", frame_design: "Frame",
  actual_play: "Actual Play", community: "Community", admin: "Admin", tech: "Tech",
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: "#e07070", medium: "#ae8c41", low: "rgba(255,255,255,0.25)",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "P1", medium: "P2", low: "P3",
};
