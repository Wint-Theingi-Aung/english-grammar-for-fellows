import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
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
          background: "#1a2744",
          borderRadius: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Teal spine accent */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 3.5,
            height: "100%",
            background: "#2a9d8f",
            borderRadius: "1.75px 0 0 1.75px",
          }}
        />
        {/* Page lines */}
        <div
          style={{
            position: "absolute",
            top: 7,
            left: 8,
            width: 18,
            height: 1.8,
            background: "white",
            opacity: 0.85,
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 8,
            width: 18,
            height: 1.3,
            background: "white",
            opacity: 0.4,
            borderRadius: 0.75,
          }}
        />
        {/* EG monogram */}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 14,
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            letterSpacing: "0.05em",
          }}
        >
          EG
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
