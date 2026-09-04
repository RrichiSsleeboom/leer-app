import { useState } from "react";
import type { QuizAttemptAnswer, QuizQuestion } from "../../types";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import styles from "./QuizRunner.module.css";

interface QuizRunnerProps {
  questions: QuizQuestion[];
  onComplete: (answers: QuizAttemptAnswer[]) => void;
}

export function QuizRunner({ questions, onComplete }: QuizRunnerProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function setAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function handleNext() {
    if (isLast) {
      const finalAnswers: QuizAttemptAnswer[] = questions.map((q) => {
        const given = answers[q.id] ?? "";
        const isCorrect = q.type === "mcq" ? given === String(q.correctOptionIndex) : null;
        return { questionId: q.id, givenAnswer: given, isCorrect };
      });
      onComplete(finalAnswers);
    } else {
      setIndex((i) => i + 1);
    }
  }

  const currentAnswer = answers[question.id] ?? "";

  return (
    <Card>
      <p className={styles.progress}>
        Vraag {index + 1} van {questions.length}
      </p>
      <p className={styles.prompt}>{question.prompt}</p>

      {question.type === "mcq" ? (
        <div className={styles.options}>
          {question.options.map((option, i) => (
            <label key={i} className={styles.optionLabel}>
              <input
                type="radio"
                name={question.id}
                checked={currentAnswer === String(i)}
                onChange={() => setAnswer(String(i))}
              />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <textarea
          className={styles.answerBox}
          rows={4}
          value={currentAnswer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Typ je antwoord..."
        />
      )}

      <div className={styles.actions}>
        <Button onClick={handleNext}>{isLast ? "Toets afronden" : "Volgende"}</Button>
      </div>
    </Card>
  );
}
