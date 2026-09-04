import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { FlashcardForm } from "../components/flashcards/FlashcardForm";
import { FlashcardReview } from "../components/flashcards/FlashcardReview";
import { AiGenerateForm } from "../components/flashcards/AiGenerateForm";
import { useAppData } from "../store/useAppData";
import { getDueCards } from "../lib/srs";
import styles from "./DeckReviewPage.module.css";

export function DeckReviewPage() {
  const { subjectId, deckId } = useParams<{ subjectId: string; deckId: string }>();
  const { subjects, decks, flashcards, flashcardActions } = useAppData();
  const [reviewing, setReviewing] = useState(false);

  const subject = subjects.find((s) => s.id === subjectId);
  const deck = decks.find((d) => d.id === deckId);

  if (!subject || !deck) {
    return <Navigate to={`/vakken/${subjectId ?? ""}`} replace />;
  }

  const cards = flashcards.filter((c) => c.deckId === deck.id);
  const dueCards = getDueCards(cards);

  if (reviewing) {
    return (
      <>
        <TopBar title={deck.name} subtitle={subject.name} />
        <PageContainer>
          <FlashcardReview cards={dueCards} onFinish={() => setReviewing(false)} />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <TopBar title={deck.name} subtitle={subject.name} />
      <PageContainer>
        <Card className={styles.startCard}>
          <div>
            <p className={styles.count}>{cards.length} kaarten in totaal</p>
            <p className={styles.due}>{dueCards.length} kaarten te herhalen vandaag</p>
          </div>
          <Button disabled={dueCards.length === 0} onClick={() => setReviewing(true)}>
            Start sessie
          </Button>
        </Card>

        <AiGenerateForm subjectName={subject.name} deckId={deck.id} defaultTopic={deck.name} />

        <Card>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Kaart handmatig toevoegen</h3>
          <FlashcardForm onSubmit={(front, back) => flashcardActions.add(deck.id, front, back)} />
        </Card>

        <Card>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Alle kaarten</h3>
          {cards.length === 0 ? (
            <EmptyState message="Nog geen kaarten in deze set." />
          ) : (
            <ul className={styles.cardList}>
              {cards.map((card) => (
                <li key={card.id} className={styles.cardItem}>
                  <div className={styles.cardContent}>
                    <span className={styles.front}>{card.front}</span>
                    <span className={styles.back}>{card.back}</span>
                  </div>
                  <div className={styles.cardMeta}>
                    <Badge tone={card.box >= 5 ? "success" : "neutral"}>box {card.box}</Badge>
                    <button className={styles.remove} onClick={() => flashcardActions.remove(card.id)}>
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </PageContainer>
    </>
  );
}
