import { prisma } from '@/lib/prisma';

export async function getBalance(userId: string) {
  const wallet = await prisma.creditWallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    // Initialize wallet for new user
    const newWallet = await prisma.creditWallet.create({
      data: {
        userId,
        balance: 50, // Starter credits
      },
    });
    return newWallet.balance;
  }

  return wallet.balance;
}

export async function deductCredits(userId: string, amount: number, feature: string) {
  return await prisma.$transaction(async (tx) => {
    const wallet = await tx.creditWallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient credits');
    }

    const updatedWallet = await tx.creditWallet.update({
      where: { userId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    await tx.creditTransaction.create({
      data: {
        walletId: wallet.id,
        amount: -amount,
        type: 'USAGE',
        feature,
      },
    });

    return updatedWallet.balance;
  });
}

/**
 * Helper to enforce credit requirements.
 * Throws an error if credits are insufficient.
 */
export async function requireCredits(userId: string, cost: number, feature: string) {
  try {
    return await deductCredits(userId, cost, feature);
  } catch (error: any) {
    if (error.message === 'Insufficient credits') {
      throw error;
    }
    throw new Error('Failed to verify credits');
  }
}

export async function addCredits(userId: string, amount: number, type: string = 'PURCHASE', reference?: string) {
  return await prisma.$transaction(async (tx) => {
    // Check if reference already exists to prevent double crediting
    if (reference) {
      const existing = await tx.creditTransaction.findUnique({
        where: { reference }
      });
      if (existing) {
        throw new Error('Reference already exists');
      }
    }

    const wallet = await tx.creditWallet.upsert({
      where: { userId },
      update: {
        balance: {
          increment: amount,
        },
      },
      create: {
        userId,
        balance: amount,
      },
    });

    await tx.creditTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type,
        reference,
      },
    });

    return wallet.balance;
  });
}
