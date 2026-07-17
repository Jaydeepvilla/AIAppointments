import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse HTML element
      <div
        style={{
          background: "#7a5af8", /* Operator primary brand color */
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          padding: "4px",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          style={{
            color: "#ffffff",
          }}
        >
          {/* Main gateway loop */}
          <path
            d="M 3 13 L 3 8 A 5 5 0 0 1 8 3 L 16 3 A 5 5 0 0 1 21 8 L 21 16 A 5 5 0 0 1 16 21 L 9 21 A 2 2 0 0 1 9 17 L 15 17 A 2 2 0 0 0 17 15 L 17 9 A 2 2 0 0 0 15 7 L 9 7 A 2 2 0 0 0 7 9 L 7 13 A 2 2 0 0 1 3 13 Z"
            fill="currentColor"
          />
          {/* Bottom-left accent square */}
          <rect x="3" y="17" width="4" height="4" rx="1.2" fill="currentColor" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}
