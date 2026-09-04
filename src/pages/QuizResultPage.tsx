import { Link, Navigate, useParams } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAppData } from "../store/useAppData";
import styles from "./QuizResultPage.module.css";

export function QuizResultPage() {
  const { subjectId, quizId, attemptId } = useParams<{
    subjectId: string;
    quizId: string;
    attemptId: string;
  }>();
  const { subjects, quizzes, quizQuestions, quizAttempts, quizAttemptActions } = useAppData();

  const subject = subjects.find((s) => s.id === subjectId);
  const quiz = quizzes.find((q) => q.id === quizId);
  const attempt = quizAttempts.find((a) => a.id === attemptId);

  if (!subject || !quiz || !attempt) {
    return <Navigate to={`/vakken/${subjectId ?? ""}`} replace />;
  }

  const questions = quizQuestions.filter((q) => q.quizId === quiz.id).sort((a, b) => a.order - b.order);

  return (
    <>
      <TopBar title="Resultaat" subtitle={quiz.title} />
      <PageContainer>
        <Card className={styles.scoreCard}>
          <span className={styles.scoreValue}>{attempt.scorePercent}%</span>
          <span className={styles.scoreLabel}>score</span>
        </Card>

        <div className={styles.list}>
          {questions.map((q, i) => {
            const answer = attempt.answers.find((a) => a.questionId === q.id);
            const given = answer?.givenAnswer ?? "";
            return (
              <Card key={q.id}>
                <p className={styles.prompt}>
                  {i + 1}. {q.prompt}
                </p>

                {q.type === "mcq" ? (
                  <div className={styles.mcqAnswer}>
                    <p>
                      Jouw antwoord: <strong>{q.options[Number(given)] ?? "(niet beantwoord)"}</strong>
                    </p>
                    <p>
                      Juiste antwoord: <strong>{q.options[q.correctOptionIndex]}</strong>
                    </p>
                    <Badge tone={answer?.isCorrect ? "success" : "warning"}>
                      {answer?.isCorrect ? "Goed" : "Fout"}
                    </Badge>
                  </div>
                ) : (
                  <div className={styles.openAnswer}>
                    <p>Jouw antwoord: {given || "(niet beantwoord)"}</p>
                    <p className={styles.sample}>Voorbeeldantwoord: {q.sampleAnswer}</p>
                    <div className={styles.markRow}>
                      <span>Zelf beoordelen:</span>
                      <Button
                        variant={answer?.isCorrect === true ? "primary" : "secondary"}
                        onClick={() => quizAttemptActions.markOpenAnswer(attempt.id, q.id, true)}
                      >
                        Goed
                      </Button>
                      <Button
                        variant={answer?.isCorrect === false ? "danger" : "secondary"}
                        onClick={() => quizAttemptActions.markOpenAnswer(attempt.id, q.id, false)}
                      >
                        Fout
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        <Link to={`/vakken/${subject.id}/toetsen/${quiz.id}`}>← Terug naar toets</Link>
      </PageContainer>
    </>
  );
}
