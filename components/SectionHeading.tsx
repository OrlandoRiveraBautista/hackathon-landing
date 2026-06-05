import { montserrat, outfit } from "@/lib/theme";

type SectionHeadingProps = {
  label: string;
  title: string;
  subtitle?: string;
};

export function SectionHeading({ label, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="text-center">
      <p
        className="text-xs tracking-[0.4em] text-[#aaff00]/80"
        style={{ fontFamily: outfit }}
      >
        {label}
      </p>
      <h2
        className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl"
        style={{ fontFamily: montserrat }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mx-auto mt-4 max-w-xl text-sm text-white/60 sm:mt-5 sm:text-base md:text-lg"
          style={{ fontFamily: outfit }}
        >
          {subtitle}
        </p>
      )}
      <div className="mx-auto mt-8 flex max-w-xs items-center gap-4">
        <div className="h-px flex-1 bg-[#aaff00]/50" />
        <svg
          width="14"
          height="14"
          viewBox="-12 -12 24 24"
          className="text-[#aaff00]"
          aria-hidden="true"
        >
          <path
            d="M0,-12 L1.5,-1.5 L12,0 L1.5,1.5 L0,12 L-1.5,1.5 L-12,0 L-1.5,-1.5 Z"
            fill="currentColor"
          />
        </svg>
        <div className="h-px flex-1 bg-[#aaff00]/50" />
      </div>
    </div>
  );
}
