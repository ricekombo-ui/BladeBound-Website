export type UserRole = "admin" | "member";

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  role: UserRole;
  avatar_color: string;
  created_at: string;
}

// ── Pipeline ────────────────────────────────────────────────────────────────

export type TaskStatus = "backlog" | "ready" | "in_progress" | "review" | "scheduled" | "published" | "repurpose";
export type TaskType   = "yt" | "infographic" | "frame_design" | "actual_play" | "community" | "admin" | "tech";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskSubtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  order_index: number;
  created_at: string;
}

export interface TaskAssignee {
  task_id: string;
  profile_id: string;
  profile: Profile;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  owner_id: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
  subtasks?: TaskSubtask[];
  assignees?: TaskAssignee[];
}

// ── Goals ───────────────────────────────────────────────────────────────────

export type GoalType   = "short" | "long";
export type GoalStatus = "active" | "completed" | "paused";

export interface Goal {
  id: string;
  title: string;
  description: string | null;
  type: GoalType;
  status: GoalStatus;
  owner_id: string | null;
  target_date: string | null;
  progress_note: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

// ── Weekly ──────────────────────────────────────────────────────────────────

export interface WeeklyMeeting {
  id: string;
  week_start: string;
  wins: string[];
  blockers: string[];
  notes: string | null;
  created_by: string | null;
  created_at: string;
  priorities?: WeeklyPriority[];
  creator?: Profile;
}

export interface WeeklyPriority {
  id: string;
  meeting_id: string;
  title: string;
  owner_id: string | null;
  completed: boolean;
  order_index: number;
  profile?: Profile;
}

// ── Check-ins ────────────────────────────────────────────────────────────────

export interface CheckIn {
  id: string;
  user_id: string;
  date: string;
  energy: number;
  wins: string | null;
  blockers: string | null;
  plan: string | null;
  created_at: string;
  profile?: Profile;
}

// ── Decisions ────────────────────────────────────────────────────────────────

export interface Decision {
  id: string;
  title: string;
  context: string | null;
  decision_text: string;
  made_by: string | null;
  date: string;
  tags: string[];
  created_at: string;
  profile?: Profile;
}
