import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import formStyles from "../ui/Form.module.css";
import { generateFlashcards, AiError, type GeneratedFlashcard } from "../../lib/aiClient";
import { useAppData } from "../../store/useAppData";
import styles from "./AiGenerateForm.module.css";

interface AiGenerateFormProps {
  subjectName: string;
  deckId: string;
  defaultTopic: string;
}

interface Candidate extends GeneratedFlashcard {
  selected: boolean;
}

export function AiGenerateForm({ subjectName, deckId, defaultTopic }: AiGenerateFormProps) {
  const { apiKey, flashcardActions } = useAppData();
  const [topic, setTopic] = useState(defaultTopic);
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!apiKey || !topic.trim()) return;
    setLoading(true);
    setError(null);
    setCandidates(null);
    try {
      const cards = await generateFlashcards(apiKey, subjectName, topic.trim(), count);
      setCandidates(cards.map((c) => ({ ...c, selected: true })));
    } catch (err) {
      setError(err instanceof AiError ? err.message : "Genereren mislukt. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  function toggle(index: number) {
    setCandidates((prev) => prev && prev.map((c, i) => (i === index ? { ...c, selected: !c.selected } : c)));
  }

  function handleAddSelected() {
    if (!candidates) return;
    candidates.filter((c) => c.selected).forEach((c) => flashcardActions.add(deckId, c.front, c.back));
    setCandidates(null);
  }

  if (!apiKey) {
    return (
      <Card className={styles.card}>
        <p>
          🤖 Laat AI flashcards voor je maken op basis van een onderwerp. Stel eerst je API key in bij{" "}
          <Link to="/instellingen">Instellingen</Link>.
        </p>
      </Card>
    );
  }

  const selectedCount = candidates?.filter((c) => c.selected).length ?? 0;

  return (
    <Card className={styles.card}>
      <h3 style={{ marginBottom: "var(--space-3)" }}>🤖 Genereer flashcards met AI</h3>
      <form className={formStyles.form} onSubmit={handleGenerate}>
        <label className={formStyles.field}>
          <span>Onderwerp</span>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Bijv. De Franse Revolutie" />
        </label>
        <label className={formStyles.field}>
          <span>Aantal kaarten</span>
          <input
            type="number"
            min={1}
            max={15}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(15, Number(e.target.value) || 1)))}
          />
        </label>
        <Button type="submit" disabled={loading || !topic.trim()}>
          {loading ? "Bezig met genereren..." : "Genereer flashcards"}
        </Button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {candidates && (
        <div className={styles.candidates}>
          <p className={styles.hint}>Kies welke kaarten je wilt toevoegen:</p>
          <ul className={styles.candidateList}>
            {candidates.map((c, i) => (
              <li key={i} className={styles.candidateItem}>
                <label className={styles.candidateLabel}>
                  <input type="checkbox" checked={c.selected} onChange={() => toggle(i)} />
                  <span>
                    <strong>{c.front}</strong>
                    <br />
                    {c.back}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <Button onClick={handleAddSelected} disabled={selectedCount === 0}>
            {selectedCount} kaarten toevoegen
          </Button>
        </div>
      )}
    </Card>
  );
}
