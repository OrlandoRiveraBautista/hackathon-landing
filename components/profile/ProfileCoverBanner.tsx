export function ProfileCoverBanner() {
  return (
    <div className="relative h-36 w-full overflow-hidden sm:h-44">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 120% at 10% 50%, rgba(170,255,0,0.22) 0%, transparent 60%),
            radial-gradient(ellipse 60% 100% at 80% 30%, rgba(0,220,130,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 50% 80% at 50% 90%, rgba(170,255,0,0.08) 0%, transparent 60%),
            linear-gradient(135deg, rgba(15,20,10,1) 0%, rgba(8,12,8,1) 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(170,255,0,0.9) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(170,255,0,0.3) 2px, rgba(170,255,0,0.3) 3px)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-[#050505]" />
      <div
        className="absolute inset-x-0 top-0 h-px opacity-40"
        style={{ background: "linear-gradient(90deg, transparent 0%, rgba(170,255,0,0.6) 50%, transparent 100%)" }}
      />
    </div>
  );
}
