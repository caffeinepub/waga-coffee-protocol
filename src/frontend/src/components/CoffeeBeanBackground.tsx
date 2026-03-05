import { useMemo } from "react";

interface Bean {
  id: number;
  left: number; // % from left
  scale: number; // 0.4 - 1.5
  duration: number; // seconds
  delay: number; // seconds
  rStart: number; // start rotation deg
  rEnd: number; // end rotation deg
  driftX: number; // px horizontal drift
  opacity: number; // 0.08 - 0.22
}

function seededRandom(seed: number) {
  // Simple LCG — deterministic per seed
  const a = 1664525;
  const c = 1013904223;
  const m = 2 ** 32;
  let s = seed;
  return () => {
    s = (a * s + c) % m;
    return s / m;
  };
}

const BEAN_COUNT = 18;

export function CoffeeBeanBackground() {
  const beans = useMemo<Bean[]>(() => {
    const rng = seededRandom(42);
    return Array.from({ length: BEAN_COUNT }, (_, i) => ({
      id: i,
      left: rng() * 98,
      scale: 0.45 + rng() * 1.1,
      duration: 18 + rng() * 22,
      delay: -(rng() * 30), // negative delay = already mid-animation on load
      rStart: rng() * 360 - 180,
      rEnd: rng() * 720 - 360,
      driftX: (rng() - 0.5) * 120,
      opacity: 0.09 + rng() * 0.14,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ willChange: "auto" }}
    >
      {beans.map((bean) => (
        <div
          key={bean.id}
          style={
            {
              position: "absolute",
              top: 0,
              left: `${bean.left}%`,
              width: `${80 * bean.scale}px`,
              height: `${40 * bean.scale}px`,
              // CSS custom properties consumed in the keyframe
              "--r-start": `${bean.rStart}deg`,
              "--r-end": `${bean.rEnd}deg`,
              "--drift-x": `${bean.driftX}px`,
              "--bean-opacity": bean.opacity,
              animation: `coffee-drift ${bean.duration}s linear ${bean.delay}s infinite`,
              willChange: "transform, opacity",
            } as React.CSSProperties
          }
        >
          <img
            src="/assets/generated/coffee-bean-transparent.dim_80x40.png"
            alt=""
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}
