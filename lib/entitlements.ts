import { prisma } from './prisma';
import { Plan, SubscriptionStatus } from '@prisma/client';

export type FeatureType = 'image' | 'video';

export const PLAN_LIMITS = {
  [Plan.STARTER]: { images: 3, videos: 0 },
  [Plan.PRO]: { images: 30, videos: 3 },
  [Plan.STUDIO]: { images: 200, videos: 20 },
};

function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function getEntitlements(clerkUserId: string) {
  const today = getStartOfToday();
  
  const user = await prisma.user.findUnique({
    where: { clerkUserId },
    include: {
      subscription: true,
      usages: {
        where: {
          date: today,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const plan = user.subscription?.plan || Plan.STARTER;
  const status = user.subscription?.status || SubscriptionStatus.ACTIVE;
  const limits = PLAN_LIMITS[plan];
  
  const todayUsage = user.usages[0] || { imagesUsed: 0, videosUsed: 0 };

  return {
    userId: user.id,
    plan,
    status,
    limits,
    usage: todayUsage,
  };
}

export async function assertEntitled(clerkUserId: string, featureType: FeatureType) {
  const entitlements = await getEntitlements(clerkUserId);
  const { userId, plan, status, limits, usage } = entitlements;

  // 1. Check subscription status (Starter is active by default)
  if (plan !== Plan.STARTER && status !== SubscriptionStatus.ACTIVE) {
    throw new Error(`Subscription is ${status.toLowerCase().replace('_', ' ')}. Please update your billing.`);
  }

  // 2. Check daily limits
  const isImage = featureType === 'image';
  const currentUsage = isImage ? usage.imagesUsed : usage.videosUsed;
  const limit = isImage ? limits.images : limits.videos;

  if (currentUsage >= limit) {
    throw new Error(`Daily limit reached for ${featureType}s on ${plan.toLowerCase()} plan.`);
  }

  // 3. Atomic increment using upsert
  const today = getStartOfToday();

  await prisma.usage.upsert({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
    update: {
      imagesUsed: isImage ? { increment: 1 } : undefined,
      videosUsed: !isImage ? { increment: 1 } : undefined,
    },
    create: {
      userId,
      date: today,
      imagesUsed: isImage ? 1 : 0,
      videosUsed: !isImage ? 1 : 0,
    },
  });

  return entitlements;
}
