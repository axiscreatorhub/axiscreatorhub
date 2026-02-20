import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617]">
      <SignUp appearance={{
        elements: {
          formButtonPrimary: 'bg-pink-600 hover:bg-pink-700 text-sm normal-case',
          card: 'bg-slate-900 border border-white/10 shadow-2xl',
          headerTitle: 'text-white',
          headerSubtitle: 'text-slate-400',
          socialButtonsBlockButton: 'bg-white/5 border-white/10 text-white hover:bg-white/10',
          dividerText: 'text-slate-500',
          formFieldLabel: 'text-slate-300',
          formFieldInput: 'bg-black/40 border-white/10 text-white',
          footerActionText: 'text-slate-400',
          footerActionLink: 'text-pink-500 hover:text-pink-400'
        }
      }} />
    </div>
  );
}
