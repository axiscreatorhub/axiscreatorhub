
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContentPoint {
  title: string;
  description: string;
}

export interface Resource {
  name: string;
  type: 'PDF' | 'Template' | 'Guide';
  size: string;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  thumbnail: string;
  description: string;
  resources?: Resource[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: string;
  features: string[];
  link: string;
  image: string;
  badge?: string;
  modules?: CourseModule[];
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: Record<string, unknown>) => { openIframe: () => void };
    };
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
