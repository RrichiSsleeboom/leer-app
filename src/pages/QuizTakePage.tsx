import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { QuestionForm } from "../components/quiz/QuestionForm";
import { QuizRunner } from "../components/quiz/QuizRunner";
import { useAppData } from "../store/useAppData";
import { todayIso } from "../lib/date";
import type { QuizAttemptAnswer } from "../types";
import styles from "./QuizTakePage.module.css";

export function QuizTakePage() {
  const { subjectId, quizId } = useParams<{ subjectId: string; quizId: string }>();
  const navigate = useNavigate();
  const { subjects, quizzes, quizQuestions, quizQuestionActions, quizAttemptActions } = useAppData();
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState<string | null>(null);

  const foundSubject = subjects.find((s) => s.id === subjectId);
  const foundQuiz = quizzes.find((q) => q.id === quizId);

  if (!foundSubject || !foundQuiz) {
    return <Navigate to={`/vakken/${subjectId ?? ""}`} replace />;
  }

  const subject = foundSubject;
  const quiz = foundQuiz;

  const questions = quizQuestions.filter((q) => q.quizId === quiz.id).sort((a, b) => a.order - b.order);

  function handleComplete(answers: QuizAttemptAnswer[]) {
    const graded = answers.filter((a) => a.isCorrect !== null);
    const scorePercent = graded.length === 0 ? 0 : Math.round((graded.filter((a) => a.isCorrect).length / graded.length) * 100);
    const attempt = quizAttemptActions.submit({
      quizId: quiz.id,
      subjectId: subject.id,
      startedAt: startedAt ?? todayIso(),
      completedAt: todayIso(),
      answers,
      scorePercent,
    });
    setRunning(false);
    navigate(`/vakken/${subject.id}/toetsen/${quiz.id}/resultaat/${attempt.id}`);
  }

  if (running) {
    return (
      <>
        <TopBar title={quiz.title} subtitle={subject.name} />
        <PageContainer>
          <QuizRunner questions={questions} onComplete={handleComplete} />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <TopBar title={quiz.title} subtitle={subject.name} />
      <PageContainer>
        <Card className={styles.startCard}>
          <p className={styles.count}>{questions.length} vragen</p>
          <Button
            disabled={questions.length === 0}
            onClick={() => {
              setStartedAt(todayIso());
              setRunning(true);
            }}
          >
            Start toets
          </Button>
        </Card>

        <Card>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Nieuwe vraag</h3>
          <QuestionForm
            onAddMcq={(prompt, options, correctIndex) =>
              quizQuestionActions.addMcq(quiz.id, prompt, options, correctIndex)
            }
            onAddOpen={(prompt, sampleAnswer) => quizQuestionActions.addOpen(quiz.id, prompt, sampleAnswer)}
          />
        </Card>

        <Card>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Vragen ({questions.length})</h3>
          {questions.length === 0 ? (
            <EmptyState message="Nog geen vragen in deze toets." />
          ) : (
            <ul className={styles.questionList}>
              {questions.map((q, i) => (
                <li key={q.id} className={styles.questionItem}>
                  <span>
                    {i + 1}. {q.prompt}
                  </span>
                  <button className={styles.remove} onClick={() => quizQuestionActions.remove(q.id)}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </PageContainer>
    </>
  );
}
