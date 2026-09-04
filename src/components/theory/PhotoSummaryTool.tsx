import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { SummaryView } from "./SummaryView";
import { summarizePhoto, AiError } from "../../lib/aiClient";
import { fileToJpegBase64 } from "../../lib/image";
import { useAppData } from "../../store/useAppData";
import styles from "./PhotoSummaryTool.module.css";

interface PhotoSummaryToolProps {
  subjectId: string;
  subjectName: string;
}

export function PhotoSummaryTool({ subjectId, subjectName }: PhotoSummaryToolProps) {
  const { apiKey, topicActions, summaryActions } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [topicName, setTopicName] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    setResult(null);
    setSaved(false);
    setLoading(true);
    try {
      const { base64, mediaType } = await fileToJpegBase64(file);
      const markdown = await summarizePhoto(apiKey!, subjectName, base64, mediaType);
      setResult(markdown);
      setTopicName(`Foto-samenvatting ${new Date().toLocaleDateString("nl-NL")}`);
    } catch (err) {
      setError(err instanceof AiError ? err.message : "Er ging iets mis bij het verwerken van de foto.");
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!result || !topicName.trim()) return;
    const topic = topicActions.add(subjectId, topicName.trim());
    summaryActions.upsert(subjectId, topic.id, topicName.trim(), result);
    setSaved(true);
  }

  if (!apiKey) {
    return (
      <Card className={styles.card}>
        <p>
          📷 Maak een foto van je schrift en laat AI het samenvatten en uitleggen. Stel eerst je API key in
          bij <Link to="/instellingen">Instellingen</Link>.
        </p>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <h3 style={{ marginBottom: "var(--space-2)" }}>📷 Samenvatten vanaf een foto</h3>
      <p className={styles.hint}>Maak een foto van je schrift of aantekeningen — AI vat het samen en legt het uit.</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <Button onClick={() => fileInputRef.current?.click()} disabled={loading}>
        {loading ? "Bezig met analyseren..." : "Foto kiezen / maken"}
      </Button>

      {error && <p className={styles.error}>{error}</p>}

      {result && (
        <div className={styles.result}>
          <SummaryView markdown={result} />
          {!saved ? (
            <div className={styles.saveRow}>
              <input
                className={styles.topicInput}
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
              />
              <Button onClick={handleSave}>Opslaan als onderwerp</Button>
            </div>
          ) : (
            <p className={styles.savedNote}>Opgeslagen bij Theorie ✓</p>
          )}
        </div>
      )}
    </Card>
  );
}
