import { Link } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { SubjectCard } from "../components/subjects/SubjectCard";
import { useAppData } from "../store/useAppData";
import { getSubjectStats } from "../lib/stats";
import styles from "./DashboardPage.module.css";

export function SubjectsOverviewPage() {
  const data = useAppData();
  const { subjects } = data;

  return (
    <>
      <TopBar title="Vakken" subtitle={`${subjects.length} vakken`} />
      <PageContainer>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link to="/beheer/vakken">⚙️ Vakken beheren</Link>
        </div>
        <div className={styles.grid}>
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} stats={getSubjectStats(subject.id, data)} />
          ))}
        </div>
      </PageContainer>
    </>
  );
}
