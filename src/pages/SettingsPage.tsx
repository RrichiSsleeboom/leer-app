import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAppData } from "../store/useAppData";
import { clearAll } from "../lib/storage";
import formStyles from "../components/ui/Form.module.css";
import styles from "./SettingsPage.module.css";

export function SettingsPage() {
  const { apiKey, setApiKey } = useAppData();
  const [value, setValue] = useState(apiKey ?? "");
  const [savedNote, setSavedNote] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiKey(value.trim() || null);
    setSavedNote(true);
    setTimeout(() => setSavedNote(false), 2000);
  }

  function handleReset() {
    const confirmed = confirm(
      "Weet je zeker dat je alles wilt wissen? Al je vakken, samenvattingen, flashcards, toetsen en taken worden verwijderd en de standaardvakken worden opnieuw ingesteld. Dit kan niet ongedaan worden gemaakt.",
    );
    if (!confirmed) return;
    clearAll();
    window.location.reload();
  }

  return (
    <>
      <TopBar title="Instellingen" subtitle="AI-functies instellen" />
      <PageContainer>
        <Card>
          <h3 style={{ marginBottom: "var(--space-3)" }}>Anthropic API key</h3>
          <p className={styles.explainer}>
            Nodig voor de AI-flashcards en het samenvatten van foto's. Deze app heeft geen eigen server, dus
            die functies praten rechtstreeks vanuit je browser met Anthropic — met jouw eigen API key.
          </p>
          <ol className={styles.steps}>
            <li>
              Maak een (gratis) account op{" "}
              <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">
                console.anthropic.com
              </a>
            </li>
            <li>Maak daar onder "API Keys" een nieuwe key aan</li>
            <li>Plak de key hieronder en klik op Opslaan</li>
          </ol>
          <p className={styles.privacyNote}>
            Je key wordt alleen lokaal in je browser bewaard (nooit verstuurd naar een andere server dan
            Anthropic zelf). Gebruik van de AI-functies verbruikt jouw eigen Anthropic-tegoed.
          </p>
          <form className={formStyles.form} onSubmit={handleSubmit}>
            <label className={formStyles.field}>
              <span>API key</span>
              <input
                type="password"
                autoComplete="off"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="sk-ant-..."
              />
            </label>
            <div className={styles.saveRow}>
              <Button type="submit">Opslaan</Button>
              {savedNote && <span className={styles.savedNote}>Opgeslagen ✓</span>}
            </div>
          </form>
        </Card>

        <Card>
          <h3 style={{ marginBottom: "var(--space-3)" }}>Gegevens</h3>
          <p className={styles.explainer}>
            Alles wat je in Stamply invult staat alleen lokaal in deze browser. Wil je helemaal opnieuw
            beginnen (bijvoorbeeld om de standaardvakken te vernieuwen)? Dan wis je hieronder alles en begin
            je weer met een lege app en de standaardvakken.
          </p>
          <Button variant="danger" onClick={handleReset}>
            Alles wissen en opnieuw beginnen
          </Button>
        </Card>
      </PageContainer>
    </>
  );
}
