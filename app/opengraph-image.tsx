import { ImageResponse } from "next/og";
import { personalInfo } from "@/content/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #09090b 0%, #1e1033 100%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#a78bfa", fontWeight: 600 }}>
          {personalInfo.role}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 16 }}>
          {personalInfo.name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            marginTop: 24,
            maxWidth: 800,
          }}
        >
          {personalInfo.tagline}
        </div>
      </div>
    ),
    size
  );
}
