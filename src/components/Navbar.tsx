export default function Navbar() {
  return (
    <nav className="h-[60px] flex items-center px-6 border-b shrink-0" style={{ borderColor: "var(--border-color)" }}>
      <div className="flex items-center gap-3">
        {/* Cake Logo */}
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 14C4 8.477 8.477 4 14 4s10 4.477 10 10-4.477 10-10 10S4 19.523 4 14z" fill="#00B894"/>
            <path d="M9 17.5L14 8l5 9.5H9z" fill="white"/>
          </svg>
          <span className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>Cake</span>
        </div>
        <div className="w-px h-5 bg-gray-200" />
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>AI Career Map</span>
        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded border" style={{ color: "var(--green-primary)", borderColor: "var(--green-primary)" }}>
          Beta
        </span>
      </div>
    </nav>
  );
}
