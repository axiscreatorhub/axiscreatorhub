export const AI_COSTS = {
  WRITING: 5,
  IMAGE_GEN: 20,
  VIDEO_SCRIPT: 10,
  BRAND_KIT: 50,
  MEDIA_KIT: 100,
} as const;

export type AICostType = keyof typeof AI_COSTS;
