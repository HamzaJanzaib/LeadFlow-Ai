import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { AIController } from "./ai.controller";
import { z } from "zod";

const chatSchema = z.object({
  message: z.string()
});

const planSchema = z.object({
  goal: z.string()
});

export const aiRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  const controller = new AIController(app);

  app.post("/chat", {
    schema: {
      body: {
        type: "object",
        properties: {
          message: { type: "string" }
        },
        required: ["message"]
      }
    }
  }, controller.chat.bind(controller));

  app.post("/plan", {
    schema: {
      body: {
        type: "object",
        properties: {
          goal: { type: "string" }
        },
        required: ["goal"]
      }
    }
  }, controller.plan.bind(controller));

  app.put("/plan/:id/approve", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      }
    }
  }, controller.approvePlan.bind(controller));

  app.get("/runs/:id", {
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string" }
        },
        required: ["id"]
      }
    }
  }, controller.getRunStatus.bind(controller));
};
