export default function EmberGlow() {
  return (
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(213,96,71,0.07) 0%, transparent 70%)",
      }}
    />
  );
}
