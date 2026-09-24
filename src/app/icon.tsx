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
          background: "#1a1f36",
          borderRadius: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
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
