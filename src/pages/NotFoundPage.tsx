import { Link } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { PageContainer } from "../components/layout/PageContainer";

export function NotFoundPage() {
  return (
    <>
      <TopBar title="Pagina niet gevonden" />
      <PageContainer>
        <p>
          Deze pagina bestaat niet. <Link to="/">Terug naar het dashboard</Link>.
        </p>
      </PageContainer>
    </>
  );
}
