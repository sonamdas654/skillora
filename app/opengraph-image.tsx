import { ImageResponse } from "next/og";

export const alt = "Skilloura — Smart Digital Services, Delivered with Skill.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const services = [
  "Websites",
  "Mobile Apps",
  "AI Automation",
  "Branding",
  "Video",
  "Marketing",
  "Dashboards",
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f4f8ff 0%, #f9fbff 45%, #eefaf4 100%)",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            left: -100,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(40,87,255,0.18), rgba(40,87,255,0) 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background:
              "radial-gradient(circle, rgba(16,185,129,0.16), rgba(16,185,129,0) 70%)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontSize: 96,
            fontWeight: 800,
            letterSpacing: -3,
          }}
        >
          <span style={{ color: "#0f172a" }}>Skill</span>
          <span style={{ color: "#2857ff" }}>o</span>
          <span style={{ color: "#0f172a" }}>ura</span>
          <span style={{ color: "#2857ff" }}>.</span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 10,
            color: "#475569",
            display: "flex",
          }}
        >
          ALL DIGITAL SOLUTIONS
        </div>

        <div
          style={{
            marginTop: 44,
            fontSize: 40,
            fontWeight: 700,
            color: "#0f172a",
            display: "flex",
          }}
        >
          Smart Digital Services, Delivered with Skill.
        </div>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 980,
          }}
        >
          {services.map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                padding: "12px 26px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(40,87,255,0.22)",
                color: "#1a3fd6",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {s}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 48,
            fontSize: 26,
            fontWeight: 600,
            color: "#10b981",
            display: "flex",
          }}
        >
          www.skilloura.com
        </div>
      </div>
    ),
    { ...size }
  );
}
