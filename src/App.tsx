import { Route, Routes } from "react-router-dom";
import { AppDataProvider } from "./store/AppDataContext";
import { Sidebar } from "./components/layout/Sidebar";
import { DashboardPage } from "./pages/DashboardPage";
import { SubjectsOverviewPage } from "./pages/SubjectsOverviewPage";
import { SubjectDetailPage } from "./pages/SubjectDetailPage";
import { TopicTheoryPage } from "./pages/TopicTheoryPage";
import { DeckReviewPage } from "./pages/DeckReviewPage";
import { QuizTakePage } from "./pages/QuizTakePage";
import { QuizResultPage } from "./pages/QuizResultPage";
import { PlannerPage } from "./pages/PlannerPage";
import { SubjectManagePage } from "./pages/SubjectManagePage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <AppDataProvider>
      <div className="app-shell">
        <Sidebar />
        <div className="app-main">
          <div className="page-content">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/vakken" element={<SubjectsOverviewPage />} />
              <Route path="/vakken/:subjectId" element={<SubjectDetailPage />} />
              <Route path="/vakken/:subjectId/theorie/:topicId" element={<TopicTheoryPage />} />
              <Route path="/vakken/:subjectId/stampen/:deckId" element={<DeckReviewPage />} />
              <Route path="/vakken/:subjectId/toetsen/:quizId" element={<QuizTakePage />} />
              <Route
                path="/vakken/:subjectId/toetsen/:quizId/resultaat/:attemptId"
                element={<QuizResultPage />}
              />
              <Route path="/beheer/vakken" element={<SubjectManagePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </AppDataProvider>
  );
}

export default App;
