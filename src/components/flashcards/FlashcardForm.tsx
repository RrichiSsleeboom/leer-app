import { useState } from "react";
import { Button } from "../ui/Button";
import formStyles from "../ui/Form.module.css";

interface FlashcardFormProps {
  onSubmit: (front: string, back: string) => void;
  initialFront?: string;
  initialBack?: string;
  submitLabel?: string;
}

export function FlashcardForm({
  onSubmit,
  initialFront = "",
  initialBack = "",
  submitLabel = "Kaart toevoegen",
}: FlashcardFormProps) {
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    onSubmit(front.trim(), back.trim());
    setFront("");
    setBack("");
  }

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <label className={formStyles.field}>
        <span>Voorkant</span>
        <textarea rows={2} value={front} onChange={(e) => setFront(e.target.value)} placeholder="Vraag / term" />
      </label>
      <label className={formStyles.field}>
        <span>Achterkant</span>
        <textarea rows={2} value={back} onChange={(e) => setBack(e.target.value)} placeholder="Antwoord / betekenis" />
      </label>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
