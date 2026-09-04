import { useState } from "react";
import { SummaryView } from "./SummaryView";
import { Button } from "../ui/Button";
import styles from "./SummaryEditor.module.css";

interface SummaryEditorProps {
  initialMarkdown: string;
  onSave: (markdown: string) => void;
}

export function SummaryEditor({ initialMarkdown, onSave }: SummaryEditorProps) {
  const [markdown, setMarkdown] = useState(initialMarkdown);
  const [tab, setTab] = useState<"schrijven" | "voorbeeld">("schrijven");

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.miniTabs}>
          <button
            className={tab === "schrijven" ? styles.active : styles.inactive}
            onClick={() => setTab("schrijven")}
          >
            Schrijven
          </button>
          <button
            className={tab === "voorbeeld" ? styles.active : styles.inactive}
            onClick={() => setTab("voorbeeld")}
          >
            Voorbeeld
          </button>
        </div>
        <Button onClick={() => onSave(markdown)}>Opslaan</Button>
      </div>

      {tab === "schrijven" ? (
        <textarea
          className={styles.textarea}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Schrijf je samenvatting in Markdown, bijv. # Titel, **vet**, - lijstitem..."
        />
      ) : (
        <div className={styles.preview}>
          <SummaryView markdown={markdown} />
        </div>
      )}
    </div>
  );
}
