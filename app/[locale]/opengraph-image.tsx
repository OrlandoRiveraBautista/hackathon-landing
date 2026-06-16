import { ImageResponse } from "next/og";

export const alt = "Build Pa'l Norte";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <svg width="220" height="220" viewBox="0 0 32 32">
          <polygon points="16,5 27,11 16,17 5,11" fill="#aaff00" />
          <polygon points="5,11 16,17 16,27 5,21" fill="#55aa00" />
          <polygon points="27,11 16,17 16,27 27,21" fill="#77cc00" />
        </svg>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          Build Pa&apos;l Norte
        </div>
      </div>
    ),
    { ...size },
  );
}
