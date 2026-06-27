import { FastifyPluginAsync } from "fastify";
import { NotificationsService } from "./notifications.service";
import { AppError } from "../../shared/errors/AppError";

export const notificationsRoutes: FastifyPluginAsync = async (app) => {
  const notificationsService = new NotificationsService(app.db);

  app.addHook("preHandler", async (request) => {
    if (!request.user) {
      throw new AppError("Unauthorized", 401);
    }
  });

  // GET /notifications
  app.get("/", async (request, reply) => {
    const userId = request.user!.id;
    const limit = request.query && (request.query as any).limit ? parseInt((request.query as any).limit) : 50;
    
    const notifications = await notificationsService.getNotifications(userId, limit);
    return reply.send(notifications);
  });

  // GET /notifications/unread-count
  app.get("/unread-count", async (request, reply) => {
    const userId = request.user!.id;
    const count = await notificationsService.getUnreadCount(userId);
    return reply.send({ count });
  });

  // POST /notifications/:id/read
  app.post<{ Params: { id: string } }>("/:id/read", async (request, reply) => {
    const userId = request.user!.id;
    const { id } = request.params;
    
    const notification = await notificationsService.markAsRead(userId, id);
    return reply.send(notification);
  });

  // POST /notifications/read-all
  app.post("/read-all", async (request, reply) => {
    const userId = request.user!.id;
    const result = await notificationsService.markAllAsRead(userId);
    return reply.send({ success: true, count: result.count });
  });

  // GET /notifications/ws
  app.get("/ws", { websocket: true }, (connection, req) => {
    // In a real app, we would authenticate the WS connection (e.g. via token in query)
    // and subscribe them to a Redis PubSub channel for their userId
    connection.socket.on("message", (message: string) => {
      // Handle incoming WS messages if needed
      if (message.toString() === "ping") {
        connection.socket.send("pong");
      }
    });

    // Simulate sending a notification for demonstration
    const demoInterval = setInterval(() => {
      connection.socket.send(JSON.stringify({
        type: "NEW_NOTIFICATION",
        data: {
          title: "Real-time Update",
          message: "WebSockets are connected and working!",
        }
      }));
    }, 30000);

    connection.socket.on("close", () => {
      clearInterval(demoInterval);
    });
  });
};
