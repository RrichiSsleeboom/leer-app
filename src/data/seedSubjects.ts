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
  { name: "Latijn", slug: "latijn", color: "#B45309", icon: "scroll" },
  { name: "Wiskunde", slug: "wiskunde", color: "#059669", icon: "calculator" },
  { name: "Biologie", slug: "biologie", color: "#65A30D", icon: "leaf" },
  { name: "Geschiedenis", slug: "geschiedenis", color: "#A16207", icon: "landmark" },
  { name: "Aardrijkskunde", slug: "aardrijkskunde", color: "#CA8A04", icon: "map" },
];

