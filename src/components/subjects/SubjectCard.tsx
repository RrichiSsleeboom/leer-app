import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { ProgressBar } from "../ui/ProgressBar";
import { Badge } from "../ui/Badge";
import { SubjectIcon } from "./SubjectIcon";
import type { Subject } from "../../types";
import type { SubjectStats } from "../../lib/stats";
import { getMasteryPercent } from "../../lib/stats";
import styles from "./SubjectCard.module.css";

interface SubjectCardProps {
  subject: Subject;
  stats: SubjectStats;
}

export function SubjectCard({ subject, stats }: SubjectCardProps) {
  const mastery = getMasteryPercent(stats);

  return (
    <Link to={`/vakken/${subject.id}`} className={styles.link}>
      <Card className={styles.card}>
        <div className={styles.top}>
          <SubjectIcon icon={subject.icon} color={subject.color} />
          {stats.cardsDue > 0 && <Badge tone="warning">{stats.cardsDue} te herhalen</Badge>}
        </div>
        <h3 className={styles.name}>{subject.name}</h3>
        <ProgressBar value={mastery} color={subject.color} />
        <div className={styles.meta}>
          <span>{mastery}% beheerst</span>
          <span>{stats.cardsTotal} kaarten</span>
        </div>
      </Card>
    </Link>
  );
}
