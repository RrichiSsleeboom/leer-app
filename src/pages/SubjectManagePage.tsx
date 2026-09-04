import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SubjectIcon, SUBJECT_ICON_KEYS } from "../components/subjects/SubjectIcon";
import { useAppData } from "../store/useAppData";
import formStyles from "../components/ui/Form.module.css";
import styles from "./SubjectManagePage.module.css";

const DEFAULT_COLOR = "#0058D3";

export function SubjectManagePage() {
  const { subjects, subjectActions } = useAppData();
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [icon, setIcon] = useState(SUBJECT_ICON_KEYS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (editingId) {
      subjectActions.update(editingId, { name: name.trim(), color, icon });
      setEditingId(null);
    } else {
      subjectActions.add({ name: name.trim(), color, icon });
    }
    setName("");
    setColor(DEFAULT_COLOR);
    setIcon(SUBJECT_ICON_KEYS[0]);
  }

  function startEdit(id: string) {
    const subject = subjects.find((s) => s.id === id);
    if (!subject) return;
    setEditingId(id);
    setName(subject.name);
    setColor(subject.color);
    setIcon(subject.icon);
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setColor(DEFAULT_COLOR);
    setIcon(SUBJECT_ICON_KEYS[0]);
  }

  function handleRemove(id: string) {
    if (confirm("Dit vak verwijderen? Alle bijbehorende onderwerpen, kaarten, toetsen en taken worden ook verwijderd.")) {
      subjectActions.remove(id);
      if (editingId === id) cancelEdit();
    }
  }

  return (
    <>
      <TopBar title="Vakken beheren" subtitle="Voeg vakken toe, pas ze aan of verwijder ze" />
      <PageContainer>
        <Card>
          <h3 style={{ marginBottom: "var(--space-4)" }}>
            {editingId ? "Vak bewerken" : "Nieuw vak toevoegen"}
          </h3>
          <form className={formStyles.form} onSubmit={handleSubmit}>
            <label className={formStyles.field}>
              <span>Naam</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Bijv. Drama" />
            </label>
            <label className={formStyles.field}>
              <span>Kleur</span>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </label>
            <label className={formStyles.field}>
              <span>Icoon</span>
              <div className={styles.iconPicker}>
                {SUBJECT_ICON_KEYS.map((key) => (
                  <button
                    type="button"
                    key={key}
                    className={key === icon ? styles.iconActive : styles.iconOption}
                    onClick={() => setIcon(key)}
                  >
                    <SubjectIcon icon={key} color={color} size={28} />
                  </button>
                ))}
              </div>
            </label>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <Button type="submit">{editingId ? "Opslaan" : "Vak toevoegen"}</Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={cancelEdit}>
                  Annuleren
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card>
          <h3 style={{ marginBottom: "var(--space-4)" }}>Alle vakken ({subjects.length})</h3>
          <ul className={styles.list}>
            {subjects.map((subject) => (
              <li key={subject.id} className={styles.item}>
                <div className={styles.itemLeft}>
                  <SubjectIcon icon={subject.icon} color={subject.color} size={28} />
                  <span>{subject.name}</span>
                  {subject.isCustom && <span className={styles.customTag}>eigen vak</span>}
                </div>
                <div className={styles.itemActions}>
                  <Button variant="ghost" onClick={() => startEdit(subject.id)}>
                    Bewerken
                  </Button>
                  <Button variant="danger" onClick={() => handleRemove(subject.id)}>
                    Verwijderen
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </PageContainer>
    </>
  );
}
