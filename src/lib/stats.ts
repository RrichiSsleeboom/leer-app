import type { Deck, Flashcard, QuizAttempt, SummaryPage, Task } from "../types";
import { getDueCards, MASTERED_BOX } from "./srs";
import { isWithinDays } from "./date";

export interface SubjectStats {
  cardsTotal: number;
  cardsMastered: number;
  cardsDue: number;
  quizzesCompleted: number;
  avgQuizScore: number | null;
  summariesCount: number;
  tasksOpen: number;
}

export function getSubjectStats(
  subjectId: string,
  data: {
    decks: Deck[];
    flashcards: Flashcard[];
    summaryPages: SummaryPage[];
    quizAttempts: QuizAttempt[];
    tasks: Task[];
  },
): SubjectStats {
  const deckIds = new Set(data.decks.filter((d) => d.subjectId === subjectId).map((d) => d.id));
  const cards = data.flashcards.filter((c) => deckIds.has(c.deckId));
  const attempts = data.quizAttempts.filter((a) => a.subjectId === subjectId);
  const summaries = data.summaryPages.filter((s) => s.subjectId === subjectId);
  const tasks = data.tasks.filter((t) => t.subjectId === subjectId && !t.done);

  return {
    cardsTotal: cards.length,
    cardsMastered: cards.filter((c) => c.box >= MASTERED_BOX && c.reviewCount > 0).length,
    cardsDue: getDueCards(cards).length,
    quizzesCompleted: attempts.length,
    avgQuizScore:
      attempts.length === 0
        ? null
        : Math.round(attempts.reduce((sum, a) => sum + a.scorePercent, 0) / attempts.length),
    summariesCount: summaries.length,
    tasksOpen: tasks.length,
  };
}

export function getMasteryPercent(stats: SubjectStats): number {
  if (stats.cardsTotal === 0) return 0;
  return Math.round((stats.cardsMastered / stats.cardsTotal) * 100);
}

export function getUpcomingTasks(tasks: Task[], days = 7): Task[] {
  return tasks
    .filter((t) => !t.done && isWithinDays(t.dueDate, days))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}
