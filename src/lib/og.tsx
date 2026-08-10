import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// Shared fake-Win95-window OG card.
export function ogWindow(title: string, heading: string, sub: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#BB0000",
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.12), transparent 65%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 960,
            backgroundColor: "#C0C0C0",
            border: "4px solid #DFDFDF",
            borderRightColor: "#0A0A0A",
            borderBottomColor: "#0A0A0A",
            boxShadow: "12px 12px 0 rgba(10,10,10,0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              backgroundImage: "linear-gradient(90deg, #BB0000, #E23A3A)",
              color: "#fff",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            <span>{title}</span>
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    width: 44,
                    height: 40,
                    backgroundColor: "#C0C0C0",
                    border: "3px solid #fff",
                    borderRightColor: "#0A0A0A",
                    borderBottomColor: "#0A0A0A",
                  }}
                >
                  <div
                    style={{
                      width: i === 0 ? 18 : 16,
                      height: i === 0 ? 5 : 16,
                      marginBottom: i === 0 ? 6 : 9,
                      backgroundColor: i === 2 ? "#BB0000" : "#0A0A0A",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              padding: "56px 48px",
              backgroundColor: "#fff",
              margin: 6,
              border: "3px solid #808080",
              borderRightColor: "#DFDFDF",
              borderBottomColor: "#DFDFDF",
            }}
          >
            <div style={{ fontSize: 72, fontWeight: 700, color: "#0A0A0A" }}>
              {heading}
            </div>
            <div style={{ fontSize: 36, color: "#444" }}>{sub}</div>
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
