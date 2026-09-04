import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export function Card({ children, className = "", style, onClick }: CardProps) {
  const classes = `${styles.card} ${onClick ? styles.clickable : ""} ${className}`.trim();
  return (
    <div className={classes} style={style} onClick={onClick}>
      {children}
    </div>
  );
}
