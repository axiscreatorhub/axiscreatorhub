import { Course } from './types';

export const plans: Course[] = [
  {
    id: 'trial',
    title: 'Hub Trial',
    description: 'Instant entry-level access to the AXIS engine. Experience the flow of high-end faceless aesthetics.',
    price: 'FREE',
    features: ['20 Visual Assets', '5 Cinematic Drops', 'Standard Analysis Node', 'HD Resolution'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1550745679-325348393049?auto=format&fit=crop&q=80&w=800',
    badge: 'Limited Hub'
  },
  {
    id: 'aesthetic',
    title: 'Aesthetic Tier',
    description: 'Engineered for Instagram curators requiring high-impact visuals and 2K rendering standards.',
    price: '$14.99/mo',
    features: ['Unlimited Visual Assets', '4K Rendering Priority', 'Imagen 4 Engine Access', 'Lifestyle Presets'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    badge: 'Creator Grade'
  },
  {
    id: 'cinema',
    title: 'Cinema Tier',
    description: 'The definitive video operating system for faceless creators. Full Veo 3.1 cinematic network access.',
    price: '$39.99/mo',
    features: ['Unlimited Cinematic Drops', '1080p Master Quality', 'Neural Voice Synthesis', 'Faceless Marketing Grounding'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=800',
    badge: 'Master Grade'
  },
  {
    id: 'nexus',
    title: 'Nexus Elite',
    description: 'The ultimate enterprise omni-AI hub. Maximum thinking budget and priority branding access.',
    price: '$159.99/mo',
    features: ['Full Elite OS Unlocked', 'Max Thinking (32K+)', '24/7 Strategic Support', 'Beta Tool Access'],
    link: '#hub',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    badge: 'Enterprise Hub'
  }
];
