export default function BackgroundDecoration() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Blob 1 */}
      <div className="absolute -top-[20%] -right-[10%] w-150 h-150 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
      {/* Blob 2 */}
      <div className="absolute -bottom-[20%] -left-[10%] w-125 h-125 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#13ec13 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}