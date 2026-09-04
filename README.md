# Leer-app

Een studie-app voor gymnasiumleerlingen, in de stijl van Somtoday. Houd al je vakken bij op één plek:

- **Theorie** — schrijf samenvattingen per onderwerp in Markdown
- **Stampen** — flashcards met spaced repetition (Leitner-systeem)
- **Toetsen** — maak oefentoetsen met meerkeuze- en open vragen
- **Planner** — huiswerk en taken bijhouden, met een voortgangsdashboard per vak

De app start met alle gymnasiumvakken (Nederlands, Engels, wiskunde A/B/C/D, klassieke talen, bètavakken, maatschappijvakken, etc.) al klaargezet — zonder ingevulde leerstof. Alle inhoud voeg je zelf toe via de app; alles wordt lokaal in je browser opgeslagen (`localStorage`), er is geen account of server nodig.

## Ontwikkelen

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Techniek

React + TypeScript + Vite, client-side (geen backend), React Router voor navigatie, `marked` voor Markdown-weergave. Zie `src/store/AppDataContext.tsx` voor de datalaag en `src/lib/srs.ts` voor het spaced-repetition-algoritme.
