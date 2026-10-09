import { ImageResponse } from "next/og";

export function iconImage(size: number, maskable = false) {
  // the maskable version keeps the check mark smaller, because Android crops its edges
  const glyph = Math.round(size * (maskable ? 0.5 : 0.6));

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2F4B7C",
      }}
    >
      <svg width={glyph} height={glyph} viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12.5l4.5 4.5L19 7.5"
          stroke="#ffffff"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>,
    { width: size, height: size },
  );
}
