import { useState } from "react";
import { Button } from "../ui/Button";
import formStyles from "../ui/Form.module.css";
import styles from "./QuestionForm.module.css";

interface QuestionFormProps {
  onAddMcq: (prompt: string, options: string[], correctOptionIndex: number) => void;
  onAddOpen: (prompt: string, sampleAnswer: string) => void;
}

export function QuestionForm({ onAddMcq, onAddOpen }: QuestionFormProps) {
  const [type, setType] = useState<"mcq" | "open">("mcq");
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [sampleAnswer, setSampleAnswer] = useState("");

  function reset() {
    setPrompt("");
    setOptions(["", ""]);
    setCorrectIndex(0);
    setSampleAnswer("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (type === "mcq") {
      const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
      if (cleanOptions.length < 2) return;
      onAddMcq(prompt.trim(), cleanOptions, Math.min(correctIndex, cleanOptions.length - 1));
    } else {
      if (!sampleAnswer.trim()) return;
      onAddOpen(prompt.trim(), sampleAnswer.trim());
    }
    reset();
  }

  function updateOption(index: number, value: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  return (
    <form className={formStyles.form} onSubmit={handleSubmit}>
      <div className={styles.typeToggle}>
        <button type="button" className={type === "mcq" ? styles.active : styles.inactive} onClick={() => setType("mcq")}>
          Meerkeuze
        </button>
        <button type="button" className={type === "open" ? styles.active : styles.inactive} onClick={() => setType("open")}>
          Open vraag
        </button>
      </div>

      <label className={formStyles.field}>
        <span>Vraag</span>
        <textarea rows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      </label>

      {type === "mcq" ? (
        <>
          {options.map((option, i) => (
            <div key={i} className={styles.optionRow}>
              <input
                type="radio"
                name="correct"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                title="Correct antwoord"
              />
              <input
                className={styles.optionInput}
                value={option}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`Optie ${i + 1}`}
              />
            </div>
          ))}
          <Button type="button" variant="ghost" onClick={() => setOptions((prev) => [...prev, ""])}>
            + Optie toevoegen
          </Button>
        </>
      ) : (
        <label className={formStyles.field}>
          <span>Voorbeeldantwoord</span>
          <textarea rows={2} value={sampleAnswer} onChange={(e) => setSampleAnswer(e.target.value)} />
        </label>
      )}

      <Button type="submit">Vraag toevoegen</Button>
    </form>
  );
}
