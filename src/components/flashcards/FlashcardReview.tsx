import { useState } from "react";
import type { Flashcard, ReviewRating } from "../../types";
import { useAppData } from "../../store/useAppData";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import styles from "./FlashcardReview.module.css";

interface FlashcardReviewProps {
  cards: Flashcard[];
  onFinish: () => void;
}

const RATINGS: { key: ReviewRating; label: string; variant: "danger" | "secondary" | "primary" | "ghost" }[] = [
  { key: "again", label: "Opnieuw", variant: "danger" },
  { key: "hard", label: "Moeilijk", variant: "secondary" },
  { key: "good", label: "Goed", variant: "primary" },
  { key: "easy", label: "Makkelijk", variant: "ghost" },
];

export function FlashcardReview({ cards, onFinish }: FlashcardReviewProps) {
  const { flashcardActions } = useAppData();
  const [queue] = useState(cards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  if (queue.length === 0) {
    return null;
  }

  if (index >= queue.length) {
    return (
      <Card className={styles.summaryCard}>
        <h3>Sessie afgerond! 🎉</h3>
        <p>Je hebt {reviewedCount} kaarten herhaald.</p>
        <Button onClick={onFinish}>Terug naar deck</Button>
      </Card>
    );
  }

  const card = queue[index];

  function handleRate(rating: ReviewRating) {
    flashcardActions.review(card.id, rating);
    setReviewedCount((c) => c + 1);
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  return (
    <div>
      <p className={styles.progress}>
        Kaart {index + 1} van {queue.length}
      </p>
      <Card className={styles.cardFace} onClick={() => setFlipped((f) => !f)}>
        <span className={styles.faceLabel}>{flipped ? "Achterkant" : "Voorkant"}</span>
        <p className={styles.faceText}>{flipped ? card.back : card.front}</p>
        {!flipped && <span className={styles.hint}>Klik om het antwoord te zien</span>}
      </Card>

      {flipped && (
        <div className={styles.ratings}>
          {RATINGS.map((r) => (
            <Button key={r.key} variant={r.variant} onClick={() => handleRate(r.key)}>
              {r.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
