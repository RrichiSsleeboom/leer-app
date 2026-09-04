export interface SeedSubject {
  name: string;
  slug: string;
  color: string;
  icon: string;
}

export const SEED_SUBJECTS: SeedSubject[] = [
  { name: "Nederlands", slug: "nederlands", color: "#0058D3", icon: "book" },
  { name: "Engels", slug: "engels", color: "#2563EB", icon: "globe" },
  { name: "Frans", slug: "frans", color: "#7C3AED", icon: "globe" },
  { name: "Duits", slug: "duits", color: "#DB2777", icon: "globe" },
  { name: "Latijn", slug: "latijn", color: "#B45309", icon: "scroll" },
  { name: "Grieks", slug: "grieks", color: "#92400E", icon: "scroll" },
  { name: "Wiskunde A", slug: "wiskunde-a", color: "#059669", icon: "calculator" },
  { name: "Wiskunde B", slug: "wiskunde-b", color: "#047857", icon: "calculator" },
  { name: "Wiskunde C", slug: "wiskunde-c", color: "#0D9488", icon: "calculator" },
  { name: "Wiskunde D", slug: "wiskunde-d", color: "#0891B2", icon: "calculator" },
  { name: "Natuurkunde", slug: "natuurkunde", color: "#0284C7", icon: "atom" },
  { name: "Scheikunde", slug: "scheikunde", color: "#16A34A", icon: "flask" },
  { name: "Biologie", slug: "biologie", color: "#65A30D", icon: "leaf" },
  { name: "Geschiedenis", slug: "geschiedenis", color: "#A16207", icon: "landmark" },
  { name: "Aardrijkskunde", slug: "aardrijkskunde", color: "#CA8A04", icon: "map" },
  { name: "Economie", slug: "economie", color: "#EA580C", icon: "chart" },
  { name: "Bedrijfseconomie", slug: "bedrijfseconomie", color: "#DC2626", icon: "briefcase" },
  { name: "Filosofie", slug: "filosofie", color: "#6D28D9", icon: "lightbulb" },
  { name: "Maatschappijwetenschappen", slug: "maatschappijwetenschappen", color: "#4338CA", icon: "users" },
  { name: "Kunst (algemeen)", slug: "kunst", color: "#C026D3", icon: "palette" },
  { name: "Informatica", slug: "informatica", color: "#1D4ED8", icon: "code" },
  { name: "Lichamelijke Opvoeding", slug: "lichamelijke-opvoeding", color: "#DC2626", icon: "activity" },
];
