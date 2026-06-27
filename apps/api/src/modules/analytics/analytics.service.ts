import { FastifyInstance } from "fastify";
import { AppError } from "../../shared/errors/AppError";
import { EmailEventType, SequenceStatus } from "@leadflow/db";

export class AnalyticsService {
  constructor(private db: FastifyInstance["db"], private redis: FastifyInstance["redis"]) {}

  public async getOverview(orgId: string) {
    const cacheKey = `analytics:overview:${orgId}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    // Calculate live if not cached (fallback)
    const [totalLeads, totalCampaigns, emailStats] = await Promise.all([
      this.db.lead.count({ where: { organizationId: orgId } }),
      this.db.campaign.count({ where: { organizationId: orgId } }),
      this.db.emailEvent.groupBy({
        by: ['event'],
        where: { organizationId: orgId },
        _count: { _all: true }
      })
    ]);

    let totalSent = 0;
    let totalOpened = 0;
    let totalClicked = 0;
    let totalReplied = 0;
    let totalBounced = 0;

    for (const stat of emailStats) {
      switch (stat.event) {
        case EmailEventType.SENT: totalSent = stat._count._all; break;
        case EmailEventType.OPENED: totalOpened = stat._count._all; break;
        case EmailEventType.CLICKED: totalClicked = stat._count._all; break;
        case EmailEventType.REPLIED: totalReplied = stat._count._all; break;
        case EmailEventType.BOUNCED: totalBounced = stat._count._all; break;
      }
    }

    // Active leads in sequences
    const activeLeads = await this.db.campaignLead.count({
      where: {
        campaign: { organizationId: orgId },
        status: SequenceStatus.ACTIVE
      }
    });

    const result = {
      totalLeads,
      totalCampaigns,
      activeLeads,
      emails: {
        sent: totalSent,
        opened: totalOpened,
        clicked: totalClicked,
        replied: totalReplied,
        bounced: totalBounced
      }
    };

    // Cache for 5 mins
    await this.redis.setex(cacheKey, 300, JSON.stringify(result));
    
    return result;
  }
}
