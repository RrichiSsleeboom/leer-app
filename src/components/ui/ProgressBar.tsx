import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  color?: string;
}

export function ProgressBar({ value, color }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={styles.track}>
      <div
        className={styles.fill}
        style={{ width: `${clamped}%`, background: color ?? "var(--color-primary)" }}
      />
    </div>
  );
}
