import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Tabs } from "../components/ui/Tabs";
import { EmptyState } from "../components/ui/EmptyState";
import { useAppData } from "../store/useAppData";
import { getDueCards } from "../lib/srs";
import styles from "./SubjectDetailPage.module.css";

type TabKey = "theorie" | "stampen" | "toetsen";

export function SubjectDetailPage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const data = useAppData();
  const { subjects, topics, decks, flashcards, quizzes, quizAttempts, topicActions, deckActions, quizActions } = data;
  const [tab, setTab] = useState<TabKey>("theorie");
  const [newName, setNewName] = useState("");

  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return <Navigate to="/vakken" replace />;
  }

  const subjectTopics = topics.filter((t) => t.subjectId === subject.id).sort((a, b) => a.order - b.order);
  const subjectDecks = decks.filter((d) => d.subjectId === subject.id);
  const subjectQuizzes = quizzes.filter((q) => q.subjectId === subject.id);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (tab === "theorie") topicActions.add(subject!.id, name);
    if (tab === "stampen") deckActions.add(subject!.id, name);
    if (tab === "toetsen") quizActions.add(subject!.id, name);
    setNewName("");
  }

  const addLabel = { theorie: "onderwerp", stampen: "kaartenset", toetsen: "toets" }[tab];

  return (
    <>
      <TopBar title={subject.name} subtitle="Theorie, flashcards en toetsen voor dit vak" />
      <PageContainer>
        <Tabs
          tabs={[
            { key: "theorie", label: "Theorie" },
            { key: "stampen", label: "Stampen" },
            { key: "toetsen", label: "Toetsen" },
          ]}
          active={tab}
          onChange={(key) => setTab(key as TabKey)}
        />

        <form className={styles.addForm} onSubmit={handleAdd}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Naam van nieuw ${addLabel}`}
          />
          <Button type="submit">+ Toevoegen</Button>
        </form>

        {tab === "theorie" &&
          (subjectTopics.length === 0 ? (
            <EmptyState message="Nog geen onderwerpen. Voeg er hierboven een toe om je eerste samenvatting te schrijven." />
          ) : (
            <div className={styles.list}>
              {subjectTopics.map((topic) => (
                <Link key={topic.id} to={`/vakken/${subject.id}/theorie/${topic.id}`}>
                  <Card className={styles.rowCard}>
                    <span>{topic.name}</span>
                    <span className={styles.arrow}>→</span>
                  </Card>
                </Link>
              ))}
            </div>
          ))}

        {tab === "stampen" &&
          (subjectDecks.length === 0 ? (
            <EmptyState message="Nog geen kaartensets. Voeg er hierboven een toe om te beginnen met stampen." />
          ) : (
            <div className={styles.list}>
              {subjectDecks.map((deck) => {
                const cards = flashcards.filter((c) => c.deckId === deck.id);
                const due = getDueCards(cards).length;
                return (
                  <Link key={deck.id} to={`/vakken/${subject.id}/stampen/${deck.id}`}>
                    <Card className={styles.rowCard}>
                      <span>{deck.name}</span>
                      <div className={styles.rowRight}>
                        <Badge tone="neutral">{cards.length} kaarten</Badge>
                        {due > 0 && <Badge tone="warning">{due} te herhalen</Badge>}
                        <span className={styles.arrow}>→</span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ))}

        {tab === "toetsen" &&
          (subjectQuizzes.length === 0 ? (
            <EmptyState message="Nog geen toetsen. Voeg er hierboven een toe om vragen te maken." />
          ) : (
            <div className={styles.list}>
              {subjectQuizzes.map((quiz) => {
                const attempts = quizAttempts.filter((a) => a.quizId === quiz.id);
                return (
                  <Link key={quiz.id} to={`/vakken/${subject.id}/toetsen/${quiz.id}`}>
                    <Card className={styles.rowCard}>
                      <span>{quiz.title}</span>
                      <div className={styles.rowRight}>
                        <Badge tone="neutral">{attempts.length}x gemaakt</Badge>
                        <span className={styles.arrow}>→</span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ))}
      </PageContainer>
    </>
  );
}
