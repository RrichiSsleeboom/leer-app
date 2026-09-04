import { useState } from "react";
import { useAppData } from "../../store/useAppData";
import { Button } from "../ui/Button";
import { todayIso } from "../../lib/date";
import styles from "../ui/Form.module.css";

interface TaskFormProps {
  onDone: () => void;
  defaultSubjectId?: string | null;
}

export function TaskForm({ onDone, defaultSubjectId = null }: TaskFormProps) {
  const { subjects, taskActions } = useAppData();
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(todayIso());
  const [subjectId, setSubjectId] = useState<string>(defaultSubjectId ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    taskActions.add({ title: title.trim(), dueDate, subjectId: subjectId || null });
    onDone();
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Taak</span>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bijv. Hoofdstuk 4 samenvatten"
        />
      </label>
      <label className={styles.field}>
        <span>Vak (optioneel)</span>
        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">Geen vak</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <label className={styles.field}>
        <span>Deadline</span>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </label>
      <Button type="submit">Taak toevoegen</Button>
    </form>
  );
}
