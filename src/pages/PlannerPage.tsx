import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskList } from "../components/tasks/TaskList";
import { useAppData } from "../store/useAppData";

export function PlannerPage() {
  const { tasks, subjects } = useAppData();
  const [showForm, setShowForm] = useState(false);

  const open = tasks.filter((t) => !t.done).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const done = tasks.filter((t) => t.done);

  return (
    <>
      <TopBar title="Planner" subtitle="Al je taken en huiswerk op een rij" />
      <PageContainer>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => setShowForm(true)}>+ Taak toevoegen</Button>
        </div>

        <Card>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Te doen ({open.length})</h3>
          <TaskList tasks={open} subjects={subjects} />
        </Card>

        {done.length > 0 && (
          <Card>
            <h3 style={{ marginBottom: "var(--space-4)" }}>Afgerond ({done.length})</h3>
            <TaskList tasks={done} subjects={subjects} />
          </Card>
        )}

        {showForm && (
          <Modal title="Nieuwe taak" onClose={() => setShowForm(false)}>
            <TaskForm onDone={() => setShowForm(false)} />
          </Modal>
        )}
      </PageContainer>
    </>
  );
}
