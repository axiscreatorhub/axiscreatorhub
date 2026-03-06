export const PACKAGES = {
  starter: { 
    id: 'starter',
    name: 'Starter',
    amount: 13500, // ~$9 (in kobo)
    credits: 100 
  },
  pro: { 
    id: 'pro',
    name: 'Pro',
    amount: 28500, // ~$19 (in kobo)
    credits: 250 
  },
  studio: { 
    id: 'studio',
    name: 'Studio',
    amount: 73500, // ~$49 (in kobo)
    credits: 700 
  },
} as const;

export type PackageId = keyof typeof PACKAGES;
