import { ImageResponse } from "next/og";
import { personalInfo } from "@/content/data";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#7c3aed",
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 700,
          borderRadius: 8,
        }}
      >
        {personalInfo.initials}
      </div>
    ),
    size
  );
}
