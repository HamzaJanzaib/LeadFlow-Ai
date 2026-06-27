import { FastifyInstance } from "fastify";
import { NotificationType } from "@leadflow/db";

export class NotificationsService {
  constructor(private db: FastifyInstance["db"]) {}

  public async getNotifications(userId: string, limit = 50) {
    return this.db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  public async getUnreadCount(userId: string) {
    return this.db.notification.count({
      where: { userId, readAt: null },
    });
  }

  public async markAsRead(userId: string, notificationId: string) {
    return this.db.notification.update({
      where: { id: notificationId, userId },
      data: { readAt: new Date() },
    });
  }

  public async markAllAsRead(userId: string) {
    return this.db.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  public async createNotification(
    orgId: string,
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    metadata?: any
  ) {
    return this.db.notification.create({
      data: {
        organizationId: orgId,
        userId,
        type,
        title,
        message,
        link: link ?? null,
        metadata: metadata ?? null,
      },
    });
  }
}
