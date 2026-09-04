import { marked } from "marked";
import styles from "./SummaryView.module.css";

interface SummaryViewProps {
  markdown: string;
}

export function SummaryView({ markdown }: SummaryViewProps) {
  const html = marked.parse(markdown, { async: false }) as string;
  return <div className={styles.content} dangerouslySetInnerHTML={{ __html: html }} />;
}
