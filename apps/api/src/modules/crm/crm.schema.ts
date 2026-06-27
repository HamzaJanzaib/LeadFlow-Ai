import { z } from "zod";
import { DealStage, TaskStatus } from "@leadflow/db";

// --- Pipelines ---
export const createPipelineSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  isDefault: z.boolean().default(false),
  currency: z.string().default("USD"),
  stages: z.array(z.object({
    name: z.string(),
    color: z.string(),
    order: z.number()
  })).default([
    { name: "Lead", color: "gray", order: 0 },
    { name: "Qualified", color: "blue", order: 1 },
    { name: "Contacted", color: "yellow", order: 2 },
    { name: "Meeting Scheduled", color: "orange", order: 3 },
    { name: "Proposal Sent", color: "purple", order: 4 },
    { name: "Negotiation", color: "pink", order: 5 },
    { name: "Won", color: "green", order: 6 },
    { name: "Lost", color: "red", order: 7 }
  ])
});

export const updatePipelineSchema = createPipelineSchema.partial();

// --- Deals ---
export const createDealSchema = z.object({
  pipelineId: z.string().uuid(),
  leadId: z.string().uuid().optional(),
  title: z.string().min(2),
  value: z.number().optional(),
  currency: z.string().default("USD"),
  stage: z.nativeEnum(DealStage).default(DealStage.LEAD),
  probability: z.number().min(0).max(100).optional(),
  expectedCloseAt: z.string().datetime().optional(), // ISO string
  description: z.string().optional(),
  source: z.string().optional()
});

export const updateDealSchema = createDealSchema.partial().extend({
  ownerId: z.string().uuid().optional().or(z.null()),
  lostReason: z.string().optional()
});

export const updateDealStageSchema = z.object({
  stage: z.nativeEnum(DealStage),
});

// --- Tasks ---
export const createTaskSchema = z.object({
  dealId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  assignedTo: z.string().uuid().optional(),
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().datetime().optional()
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.nativeEnum(TaskStatus).optional(),
  completedAt: z.string().datetime().optional().or(z.null())
});

// --- Meetings ---
export const createMeetingSchema = z.object({
  dealId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  title: z.string().min(2),
  description: z.string().optional(),
  scheduledAt: z.string().datetime(),
  duration: z.number().int().min(1).default(30), // minutes
  location: z.string().optional(),
  meetingUrl: z.string().url().optional()
});
