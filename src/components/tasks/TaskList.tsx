import type { Task, Subject } from "../../types";
import { useAppData } from "../../store/useAppData";
import { formatDateNL, todayIso } from "../../lib/date";
import styles from "./TaskList.module.css";

interface TaskListProps {
  tasks: Task[];
  subjects: Subject[];
}

export function TaskList({ tasks, subjects }: TaskListProps) {
  const { taskActions } = useAppData();
  const today = todayIso();

  if (tasks.length === 0) {
    return <p className={styles.empty}>Geen taken.</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => {
        const subject = subjects.find((s) => s.id === task.subjectId);
        const overdue = !task.done && task.dueDate < today;
        return (
          <li key={task.id} className={styles.item}>
            <label className={styles.left}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => taskActions.toggleDone(task.id)}
              />
              <span className={task.done ? styles.doneTitle : undefined}>{task.title}</span>
            </label>
            <div className={styles.right}>
              {subject && (
                <span className={styles.subjectTag} style={{ color: subject.color }}>
                  {subject.name}
                </span>
              )}
              <span className={overdue ? styles.overdue : styles.due}>{formatDateNL(task.dueDate)}</span>
              <button className={styles.remove} onClick={() => taskActions.remove(task.id)} aria-label="Verwijderen">
                ×
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
