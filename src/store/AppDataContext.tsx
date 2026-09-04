import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import type {
  Deck,
  Flashcard,
  McqQuestion,
  OpenQuestion,
  Quiz,
  QuizAttempt,
  QuizQuestion,
  ReviewRating,
  Subject,
  SummaryPage,
  Task,
  Topic,
} from "../types";
import { getItem, setItem } from "../lib/storage";
import { createId } from "../lib/ids";
import { todayIso } from "../lib/date";
import { applyReview, createNewCardState } from "../lib/srs";
import { SEED_SUBJECTS } from "../data/seedSubjects";

interface Meta {
  seeded: boolean;
}

interface AppState {
  subjects: Subject[];
  topics: Topic[];
  summaryPages: SummaryPage[];
  decks: Deck[];
  flashcards: Flashcard[];
  quizzes: Quiz[];
  quizQuestions: QuizQuestion[];
  quizAttempts: QuizAttempt[];
  tasks: Task[];
}

function loadInitialState(): AppState {
  const meta = getItem<Meta>("meta", { seeded: false });
  let subjects = getItem<Subject[]>("subjects", []);

  if (!meta.seeded) {
    subjects = SEED_SUBJECTS.map((s) => ({
      id: createId(),
      name: s.name,
      slug: s.slug,
      color: s.color,
      icon: s.icon,
      isCustom: false,
      createdAt: todayIso(),
    }));
    setItem("subjects", subjects);
    setItem<Meta>("meta", { seeded: true });
  }

  return {
    subjects,
    topics: getItem("topics", []),
    summaryPages: getItem("summaryPages", []),
    decks: getItem("decks", []),
    flashcards: getItem("flashcards", []),
    quizzes: getItem("quizzes", []),
    quizQuestions: getItem("quizQuestions", []),
    quizAttempts: getItem("quizAttempts", []),
    tasks: getItem("tasks", []),
  };
}

interface AppDataContextValue extends AppState {
  subjectActions: {
    add: (input: { name: string; color: string; icon: string }) => Subject;
    update: (id: string, patch: Partial<Pick<Subject, "name" | "color" | "icon">>) => void;
    remove: (id: string) => void;
  };
  topicActions: {
    add: (subjectId: string, name: string) => Topic;
    update: (id: string, patch: Partial<Pick<Topic, "name" | "order">>) => void;
    remove: (id: string) => void;
  };
  summaryActions: {
    upsert: (subjectId: string, topicId: string, title: string, markdown: string) => void;
  };
  deckActions: {
    add: (subjectId: string, name: string, topicId?: string) => Deck;
    update: (id: string, patch: Partial<Pick<Deck, "name" | "topicId">>) => void;
    remove: (id: string) => void;
  };
  flashcardActions: {
    add: (deckId: string, front: string, back: string) => Flashcard;
    update: (id: string, patch: Partial<Pick<Flashcard, "front" | "back">>) => void;
    remove: (id: string) => void;
    review: (id: string, rating: ReviewRating) => void;
  };
  quizActions: {
    add: (subjectId: string, title: string, topicId?: string) => Quiz;
    update: (id: string, patch: Partial<Pick<Quiz, "title" | "topicId">>) => void;
    remove: (id: string) => void;
  };
  quizQuestionActions: {
    addMcq: (quizId: string, prompt: string, options: string[], correctOptionIndex: number) => McqQuestion;
    addOpen: (quizId: string, prompt: string, sampleAnswer: string) => OpenQuestion;
    remove: (id: string) => void;
  };
  quizAttemptActions: {
    submit: (attempt: Omit<QuizAttempt, "id">) => QuizAttempt;
    markOpenAnswer: (attemptId: string, questionId: string, isCorrect: boolean) => void;
  };
  taskActions: {
    add: (input: { title: string; dueDate: string; subjectId: string | null }) => Task;
    update: (id: string, patch: Partial<Pick<Task, "title" | "dueDate" | "subjectId">>) => void;
    toggleDone: (id: string) => void;
    remove: (id: string) => void;
  };
}

export const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadInitialState);

  const persist = useCallback(<K extends keyof AppState>(key: K, value: AppState[K]) => {
    setItem(key, value);
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const subjectActions = useMemo(
    () => ({
      add: (input: { name: string; color: string; icon: string }) => {
        const subject: Subject = {
          id: createId(),
          name: input.name,
          slug: input.name.toLowerCase().trim().replace(/\s+/g, "-"),
          color: input.color,
          icon: input.icon,
          isCustom: true,
          createdAt: todayIso(),
        };
        persist("subjects", [...state.subjects, subject]);
        return subject;
      },
      update: (id: string, patch: Partial<Pick<Subject, "name" | "color" | "icon">>) => {
        persist(
          "subjects",
          state.subjects.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        );
      },
      remove: (id: string) => {
        const topicIds = new Set(state.topics.filter((t) => t.subjectId === id).map((t) => t.id));
        const deckIds = new Set(state.decks.filter((d) => d.subjectId === id).map((d) => d.id));
        const quizIds = new Set(state.quizzes.filter((q) => q.subjectId === id).map((q) => q.id));

        persist("subjects", state.subjects.filter((s) => s.id !== id));
        persist("topics", state.topics.filter((t) => t.subjectId !== id));
        persist("summaryPages", state.summaryPages.filter((s) => s.subjectId !== id));
        persist("decks", state.decks.filter((d) => d.subjectId !== id));
        persist("flashcards", state.flashcards.filter((c) => !deckIds.has(c.deckId)));
        persist("quizzes", state.quizzes.filter((q) => q.subjectId !== id));
        persist("quizQuestions", state.quizQuestions.filter((q) => !quizIds.has(q.quizId)));
        persist("quizAttempts", state.quizAttempts.filter((a) => a.subjectId !== id));
        persist("tasks", state.tasks.filter((t) => t.subjectId !== id));
        void topicIds;
      },
    }),
    [state, persist],
  );

  const topicActions = useMemo(
    () => ({
      add: (subjectId: string, name: string) => {
        const topic: Topic = {
          id: createId(),
          subjectId,
          name,
          order: state.topics.filter((t) => t.subjectId === subjectId).length,
          createdAt: todayIso(),
        };
        persist("topics", [...state.topics, topic]);
        return topic;
      },
      update: (id: string, patch: Partial<Pick<Topic, "name" | "order">>) => {
        persist(
          "topics",
          state.topics.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        );
      },
      remove: (id: string) => {
        persist("topics", state.topics.filter((t) => t.id !== id));
        persist("summaryPages", state.summaryPages.filter((s) => s.topicId !== id));
        persist(
          "decks",
          state.decks.map((d) => (d.topicId === id ? { ...d, topicId: undefined } : d)),
        );
        persist(
          "quizzes",
          state.quizzes.map((q) => (q.topicId === id ? { ...q, topicId: undefined } : q)),
        );
      },
    }),
    [state, persist],
  );

  const summaryActions = useMemo(
    () => ({
      upsert: (subjectId: string, topicId: string, title: string, markdown: string) => {
        const existing = state.summaryPages.find((s) => s.topicId === topicId);
        if (existing) {
          persist(
            "summaryPages",
            state.summaryPages.map((s) =>
              s.id === existing.id ? { ...s, title, markdown, updatedAt: todayIso() } : s,
            ),
          );
        } else {
          const page: SummaryPage = {
            id: createId(),
            subjectId,
            topicId,
            title,
            markdown,
            updatedAt: todayIso(),
          };
          persist("summaryPages", [...state.summaryPages, page]);
        }
      },
    }),
    [state, persist],
  );

  const deckActions = useMemo(
    () => ({
      add: (subjectId: string, name: string, topicId?: string) => {
        const deck: Deck = { id: createId(), subjectId, name, topicId, createdAt: todayIso() };
        persist("decks", [...state.decks, deck]);
        return deck;
      },
      update: (id: string, patch: Partial<Pick<Deck, "name" | "topicId">>) => {
        persist(
          "decks",
          state.decks.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        );
      },
      remove: (id: string) => {
        persist("decks", state.decks.filter((d) => d.id !== id));
        persist("flashcards", state.flashcards.filter((c) => c.deckId !== id));
      },
    }),
    [state, persist],
  );

  const flashcardActions = useMemo(
    () => ({
      add: (deckId: string, front: string, back: string) => {
        const card: Flashcard = {
          id: createId(),
          deckId,
          front,
          back,
          createdAt: todayIso(),
          ...createNewCardState(),
        };
        persist("flashcards", [...state.flashcards, card]);
        return card;
      },
      update: (id: string, patch: Partial<Pick<Flashcard, "front" | "back">>) => {
        persist(
          "flashcards",
          state.flashcards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        );
      },
      remove: (id: string) => {
        persist("flashcards", state.flashcards.filter((c) => c.id !== id));
      },
      review: (id: string, rating: ReviewRating) => {
        persist(
          "flashcards",
          state.flashcards.map((c) => (c.id === id ? { ...c, ...applyReview(c, rating) } : c)),
        );
      },
    }),
    [state, persist],
  );

  const quizActions = useMemo(
    () => ({
      add: (subjectId: string, title: string, topicId?: string) => {
        const quiz: Quiz = { id: createId(), subjectId, title, topicId, createdAt: todayIso() };
        persist("quizzes", [...state.quizzes, quiz]);
        return quiz;
      },
      update: (id: string, patch: Partial<Pick<Quiz, "title" | "topicId">>) => {
        persist(
          "quizzes",
          state.quizzes.map((q) => (q.id === id ? { ...q, ...patch } : q)),
        );
      },
      remove: (id: string) => {
        persist("quizzes", state.quizzes.filter((q) => q.id !== id));
        persist("quizQuestions", state.quizQuestions.filter((q) => q.quizId !== id));
        persist("quizAttempts", state.quizAttempts.filter((a) => a.quizId !== id));
      },
    }),
    [state, persist],
  );

  const quizQuestionActions = useMemo(
    () => ({
      addMcq: (quizId: string, prompt: string, options: string[], correctOptionIndex: number) => {
        const question: McqQuestion = {
          id: createId(),
          quizId,
          type: "mcq",
          prompt,
          options,
          correctOptionIndex,
          order: state.quizQuestions.filter((q) => q.quizId === quizId).length,
        };
        persist("quizQuestions", [...state.quizQuestions, question]);
        return question;
      },
      addOpen: (quizId: string, prompt: string, sampleAnswer: string) => {
        const question: OpenQuestion = {
          id: createId(),
          quizId,
          type: "open",
          prompt,
          sampleAnswer,
          order: state.quizQuestions.filter((q) => q.quizId === quizId).length,
        };
        persist("quizQuestions", [...state.quizQuestions, question]);
        return question;
      },
      remove: (id: string) => {
        persist("quizQuestions", state.quizQuestions.filter((q) => q.id !== id));
      },
    }),
    [state, persist],
  );

  const quizAttemptActions = useMemo(
    () => ({
      submit: (attempt: Omit<QuizAttempt, "id">) => {
        const full: QuizAttempt = { id: createId(), ...attempt };
        persist("quizAttempts", [...state.quizAttempts, full]);
        return full;
      },
      markOpenAnswer: (attemptId: string, questionId: string, isCorrect: boolean) => {
        persist(
          "quizAttempts",
          state.quizAttempts.map((a) => {
            if (a.id !== attemptId) return a;
            const answers = a.answers.map((ans) =>
              ans.questionId === questionId ? { ...ans, isCorrect } : ans,
            );
            const scorePercent =
              answers.length === 0
                ? 0
                : Math.round((answers.filter((ans) => ans.isCorrect).length / answers.length) * 100);
            return { ...a, answers, scorePercent };
          }),
        );
      },
    }),
    [state, persist],
  );

  const taskActions = useMemo(
    () => ({
      add: (input: { title: string; dueDate: string; subjectId: string | null }) => {
        const task: Task = {
          id: createId(),
          title: input.title,
          dueDate: input.dueDate,
          subjectId: input.subjectId,
          done: false,
          createdAt: todayIso(),
        };
        persist("tasks", [...state.tasks, task]);
        return task;
      },
      update: (id: string, patch: Partial<Pick<Task, "title" | "dueDate" | "subjectId">>) => {
        persist(
          "tasks",
          state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        );
      },
      toggleDone: (id: string) => {
        persist(
          "tasks",
          state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        );
      },
      remove: (id: string) => {
        persist("tasks", state.tasks.filter((t) => t.id !== id));
      },
    }),
    [state, persist],
  );

  const value: AppDataContextValue = {
    ...state,
    subjectActions,
    topicActions,
    summaryActions,
    deckActions,
    flashcardActions,
    quizActions,
    quizQuestionActions,
    quizAttemptActions,
    taskActions,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
