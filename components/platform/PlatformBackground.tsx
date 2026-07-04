export function PlatformBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="auth-blob-1 absolute -top-60 -left-60 h-[700px] w-[700px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(170,255,0,0.22) 0%, rgba(100,200,0,0.08) 45%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      <div
        className="auth-blob-2 absolute top-1/3 -right-48 h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,220,130,0.14) 0%, rgba(0,180,100,0.05) 50%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="auth-blob-3 absolute -bottom-40 left-1/4 h-[420px] w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(170,255,0,0.1) 0%, rgba(50,150,0,0.04) 55%, transparent 72%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(170,255,0,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
