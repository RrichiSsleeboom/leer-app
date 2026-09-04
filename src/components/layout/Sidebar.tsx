import { NavLink } from "react-router-dom";
import { useAppData } from "../../store/useAppData";
import { SubjectIcon } from "../subjects/SubjectIcon";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const { subjects } = useAppData();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>L</span>
        <span>Leer-app</span>
      </div>

      <nav className={styles.nav}>
        <NavLink to="/" end className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
          🏠 Dashboard
        </NavLink>
        <NavLink to="/planner" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
          🗓️ Planner
        </NavLink>
        <NavLink to="/vakken" end className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
          📚 Vakken
        </NavLink>
      </nav>

      <div className={styles.subjectsHeading}>Mijn vakken</div>
      <nav className={styles.subjectList}>
        {subjects.map((subject) => (
          <NavLink
            key={subject.id}
            to={`/vakken/${subject.id}`}
            className={({ isActive }) => (isActive ? styles.activeSubject : styles.subjectLink)}
          >
            <SubjectIcon icon={subject.icon} color={subject.color} size={22} />
            <span className={styles.subjectName}>{subject.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footerLinks}>
        <NavLink to="/beheer/vakken" className={styles.manageLink}>
          ⚙️ Vakken beheren
        </NavLink>
        <NavLink to="/instellingen" className={styles.manageLink}>
          🤖 Instellingen
        </NavLink>
      </div>
    </aside>
  );
}
