"use client";

import { useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleBackgroundClick = () => {
    router.push("https://ticket-support-kappa.vercel.app/");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 relative overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-[40%] -left-[20%] h-[80%] w-[60%] rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[50%] w-[40%] rounded-full bg-primary/2 blur-3xl" />
      </div>

      {/* Website as background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <iframe
          src="https://ticket-support-kappa.vercel.app/"
          className="w-full h-full scale-105 origin-center opacity-50 blur-[2px]"
          title="Website Preview"
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] z-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div 
        className="relative z-10 w-full max-w-md px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
