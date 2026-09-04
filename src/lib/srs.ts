import type { Flashcard, ReviewRating } from "../types";
import { addDaysIso, isDue, todayIso } from "./date";

const BOX_INTERVAL_DAYS: Record<number, number> = {
  1: 1,
  2: 2,
  3: 4,
  4: 7,
  5: 14,
};

const MIN_BOX = 1;
const MAX_BOX = 5;
export const MASTERED_BOX = 5;

export function createNewCardState(): Pick<Flashcard, "box" | "dueDate" | "lastReviewedAt" | "reviewCount"> {
  return {
    box: MIN_BOX,
    dueDate: todayIso(),
    lastReviewedAt: null,
    reviewCount: 0,
  };
}

export function applyReview(
  card: Flashcard,
  rating: ReviewRating,
): Pick<Flashcard, "box" | "dueDate" | "lastReviewedAt" | "reviewCount"> {
  let box = card.box;
  if (rating === "again") {
    box = MIN_BOX;
  } else if (rating === "hard") {
    box = Math.max(MIN_BOX, box);
  } else if (rating === "good") {
    box = Math.min(MAX_BOX, box + 1);
  } else {
    box = Math.min(MAX_BOX, box + 2);
  }

  const intervalDays = rating === "again" ? 1 : BOX_INTERVAL_DAYS[box];
  const today = todayIso();

  return {
    box,
    dueDate: addDaysIso(today, intervalDays),
    lastReviewedAt: today,
    reviewCount: card.reviewCount + 1,
  };
}

export function getDueCards(cards: Flashcard[]): Flashcard[] {
  return cards
    .filter((card) => isDue(card.dueDate))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.box - b.box);
}
