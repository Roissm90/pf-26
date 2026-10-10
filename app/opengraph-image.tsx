import { ImageResponse } from "next/og";
import { personalInfo } from "@/content/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${personalInfo.name} - ${personalInfo.role}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          background: "#09090b",
          borderTop: "8px solid #6ee7b7",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
          <div style={{ display: "flex", fontSize: 196, fontWeight: 700, color: "#6ee7b7", lineHeight: 1 }}>
            {personalInfo.initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", borderLeft: "2px solid #27272a", paddingLeft: 40 }}>
            <div style={{ fontSize: 46, fontWeight: 700, maxWidth: 570, lineHeight: 1.2 }}>
              {personalInfo.name}
            </div>
            <div style={{ fontSize: 28, color: "#6ee7b7", marginTop: 18 }}>
              {personalInfo.role}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", borderTop: "2px solid #27272a", paddingTop: 30 }}>
          <div style={{ fontSize: 28, color: "#e4e4e7", lineHeight: 1.5 }}>
            {personalInfo.tagline}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#a1a1aa", marginTop: 20 }}>
            React · Next.js · {personalInfo.location}
          </div>
        </div>
      </div>
    ),
    size
  );
}
