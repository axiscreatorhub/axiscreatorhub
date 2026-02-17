
import React, { useState } from 'react';
import { FAQItem } from '../types';

const faqItems: FAQItem[] = [
  {
    question: "How is this different from other marketing courses?",
    answer: "Most courses take you down complex rabbit holes designed to upsell you. We offer a direct path: pure skills, tools, and effective strategies that work right now, with zero fluff or hidden costs."
  },
  {
    question: "Do I need a large following to start?",
    answer: "Not at all. Our system is designed to help you build from scratch using fundamental marketing principles. We focus on conversion, not just vanity metrics."
  },
  {
    question: "What specific tools are included?",
    answer: "You'll receive our custom Influence-CRM, the Content Automation Blueprint, and our proprietary 'Direct Ad' frameworks used by top creators."
  },
  {
    question: "Is there a money-back guarantee?",
    answer: "Yes, we offer a 30-day performance guarantee. If you don't feel like you've gained practical, actionable skills, we'll provide a 100% refund."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-900">Common Questions</h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-slate-200 rounded-2xl bg-white overflow-hidden group shadow-sm">
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{item.question}</span>
                <span className={`transform transition-transform ${openIndex === index ? 'rotate-180 text-orange-500' : 'text-slate-400'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
