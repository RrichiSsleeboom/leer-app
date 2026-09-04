import { Navigate, useParams } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { SummaryEditor } from "../components/theory/SummaryEditor";
import { useAppData } from "../store/useAppData";

export function TopicTheoryPage() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>();
  const { subjects, topics, summaryPages, summaryActions } = useAppData();

  const subject = subjects.find((s) => s.id === subjectId);
  const topic = topics.find((t) => t.id === topicId);

  if (!subject || !topic) {
    return <Navigate to={`/vakken/${subjectId ?? ""}`} replace />;
  }

  const summary = summaryPages.find((s) => s.topicId === topic.id);

  return (
    <>
      <TopBar title={topic.name} subtitle={subject.name} />
      <PageContainer>
        <Card>
          <SummaryEditor
            initialMarkdown={summary?.markdown ?? ""}
            onSave={(markdown) => summaryActions.upsert(subject.id, topic.id, topic.name, markdown)}
          />
        </Card>
      </PageContainer>
    </>
  );
}
