export type ReviewRating = "again" | "hard" | "good" | "easy";

export interface Deck {
  id: string;
  subjectId: string;
  topicId?: string;
  name: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  box: number;
  dueDate: string;
  lastReviewedAt: string | null;
  reviewCount: number;
  createdAt: string;
}
