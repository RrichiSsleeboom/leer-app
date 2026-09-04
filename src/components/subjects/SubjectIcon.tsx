const ICON_MAP: Record<string, string> = {
  book: "📖",
  globe: "🌍",
  scroll: "📜",
  calculator: "🧮",
  atom: "⚛️",
  flask: "🧪",
  leaf: "🌿",
  landmark: "🏛️",
  map: "🗺️",
  chart: "📊",
  briefcase: "💼",
  lightbulb: "💡",
  users: "👥",
  palette: "🎨",
  code: "💻",
  activity: "🏃",
};

interface SubjectIconProps {
  icon: string;
  color: string;
  size?: number;
}

export function SubjectIcon({ icon, color, size = 36 }: SubjectIconProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "10px",
        background: `${color}1a`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.55,
        flexShrink: 0,
      }}
    >
      {ICON_MAP[icon] ?? "📚"}
    </div>
  );
}

export const SUBJECT_ICON_KEYS = Object.keys(ICON_MAP);
