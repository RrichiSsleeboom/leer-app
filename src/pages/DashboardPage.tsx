import { Link } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { SubjectCard } from "../components/subjects/SubjectCard";
import { TaskList } from "../components/tasks/TaskList";
import { useAppData } from "../store/useAppData";
import { getSubjectStats, getUpcomingTasks } from "../lib/stats";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const data = useAppData();
  const { subjects, tasks } = data;

  const upcoming = getUpcomingTasks(tasks, 7);
  const totalDue = subjects.reduce((sum, s) => sum + getSubjectStats(s.id, data).cardsDue, 0);

  return (
    <>
      <TopBar title="Dashboard" subtitle="Welkom terug! Dit is jouw overzicht." />
      <PageContainer>
        <div className={styles.statsRow}>
          <Card className={styles.statCard}>
            <span className={styles.statValue}>{subjects.length}</span>
            <span className={styles.statLabel}>vakken</span>
          </Card>
          <Card className={styles.statCard}>
            <span className={styles.statValue}>{totalDue}</span>
            <span className={styles.statLabel}>kaarten te herhalen</span>
          </Card>
          <Card className={styles.statCard}>
            <span className={styles.statValue}>{upcoming.length}</span>
            <span className={styles.statLabel}>taken deze week</span>
          </Card>
        </div>

        <div>
          <div className={styles.sectionHeader}>
            <h2>Jouw vakken</h2>
            <Link to="/vakken">Alle vakken →</Link>
          </div>
          <div className={styles.grid}>
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} stats={getSubjectStats(subject.id, data)} />
            ))}
          </div>
        </div>

        <Card>
          <div className={styles.sectionHeader}>
            <h2>Deze week</h2>
            <Link to="/planner">Planner →</Link>
          </div>
          <TaskList tasks={upcoming} subjects={subjects} />
        </Card>
      </PageContainer>
    </>
  );
}
