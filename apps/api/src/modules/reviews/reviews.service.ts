import { FastifyInstance } from "fastify";
import { AppError } from "../../shared/errors/AppError";

export class ReviewsService {
  constructor(private db: FastifyInstance["db"]) {}

  public async requestReview(orgId: string, email: string, name: string, dealId?: string, message?: string) {
    // In a real application, this would send an email via Resend/SendGrid 
    // linking to a review form (e.g. G2, Trustpilot, or custom).
    // For now, we mock the successful dispatch.
    
    // Validate org exists
    const org = await this.db.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new AppError("Organization not found", 404);

    return {
      success: true,
      message: `Review request successfully sent to ${name} (${email})`,
      dealId,
      dispatchedAt: new Date(),
    };
  }

  public async createReferralCampaign(orgId: string, data: any) {
    // We do not have a Prisma model for Referral yet, so we mock the creation
    const campaignId = `ref_camp_${Math.random().toString(36).substr(2, 9)}`;
    const referralCode = Math.random().toString(36).substr(2, 6).toUpperCase();

    return {
      id: campaignId,
      organizationId: orgId,
      campaignName: data.campaignName,
      rewardAmount: data.rewardAmount,
      currency: data.currency,
      referralCode,
      status: "ACTIVE",
      createdAt: new Date(),
    };
  }

  public async getReferrals(orgId: string) {
    // Return mock data for referrals
    return [
      {
        id: "ref_1",
        code: "SUMMER26",
        campaignName: "Summer Referral Push",
        rewardAmount: 100,
        currency: "USD",
        status: "ACTIVE",
        conversions: 5,
        totalRewarded: 500,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      {
        id: "ref_2",
        code: "PARTNERVIP",
        campaignName: "VIP Partner Program",
        rewardAmount: 500,
        currency: "USD",
        status: "ACTIVE",
        conversions: 2,
        totalRewarded: 1000,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      }
    ];
  }

  public async trackReferralConversion(orgId: string, code: string) {
    // Mock the tracking of a referral conversion
    return {
      success: true,
      message: `Conversion successfully tracked for referral code: ${code}`,
      rewardPending: true,
      trackedAt: new Date(),
    };
  }
}
