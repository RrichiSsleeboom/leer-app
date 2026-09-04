import styles from "./TopBar.module.css";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

const TODAY_FORMATTER = new Intl.DateTimeFormat("nl-NL", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className={styles.topbar}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.date}>{TODAY_FORMATTER.format(new Date())}</div>
    </header>
  );
}
