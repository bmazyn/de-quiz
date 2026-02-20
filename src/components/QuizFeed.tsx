import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import QuizCard from "./QuizCard";
import type { Question, ChoiceKey, AnswerState } from "../types";
import questionsData from "../data/questions.json";
import { getDeckIdByName } from "../utils/decks";
import "./QuizFeed.css";

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizFeed() {
  const navigate = useNavigate();
  const location = useLocation();
  const { deckId } = useParams<{ deckId: string }>();
  
  const [filteredCards, setFilteredCards] = useState<Question[]>([]);
  const [shuffledDeck, setShuffledDeck] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>({
    selectedChoice: null,
    isCorrect: null,
  });

  // Initialize shuffled deck on mount
  useEffect(() => {
    // Ensure questionsData is an array
    const allQuestions = Array.isArray(questionsData) ? questionsData as Question[] : [questionsData as Question];
    
    let filtered: Question[];
    
    // Get selectedDecks from navigation state (array of deck names)
    const stateData = location.state as { selectedDecks?: string[] } | null;
    const selectedDeckNames = stateData?.selectedDecks;
    
    if (deckId) {
      // Filter by deckId from route param (single deck)
      filtered = allQuestions.filter(q => q.deckId === deckId);
      console.log(`🎯 QuizFeed: Loaded ${filtered.length} cards for deckId="${deckId}"`);
    } else if (selectedDeckNames && selectedDeckNames.length > 0) {
      // Convert deck names to deck IDs
      const deckIds = selectedDeckNames
        .map(name => getDeckIdByName(name))
        .filter((id): id is string => id !== undefined);
      
      console.log(`🎯 QuizFeed: Converting deck names to IDs:`, selectedDeckNames, '→', deckIds);
      
      // Filter by the selected deck IDs
      filtered = allQuestions.filter(q => deckIds.includes(q.deckId));
      console.log(`🎯 QuizFeed: Loaded ${filtered.length} cards for ${deckIds.length} deck(s)`);
    } else {
      // No filtering - use all questions
      filtered = allQuestions;
      console.log(`🎯 QuizFeed: No deck specified, loaded all ${filtered.length} cards`);
    }
    
    setFilteredCards(filtered);
    setShuffledDeck(shuffleArray(filtered));
  }, [deckId, location.state]);

  const handleAnswer = (choice: ChoiceKey) => {
    const currentCard = shuffledDeck[currentIndex];
    const isCorrect = choice === currentCard.answer;

    setAnswerState({
      selectedChoice: choice,
      isCorrect,
    });

    // Track stats per deck using the card's deckId
    const cardDeckId = currentCard.deckId;
    if (cardDeckId) {
      try {
        const key = `de_quiz_stats:${cardDeckId}`;
        const stored = localStorage.getItem(key);
        const stats = stored ? JSON.parse(stored) : { attempts: 0, correct: 0 };
        
        stats.attempts += 1;
        if (isCorrect) {
          stats.correct += 1;
        }
        
        localStorage.setItem(key, JSON.stringify(stats));
      } catch {
        // Fail silently
      }
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= shuffledDeck.length) {
      // Restart deck
      setShuffledDeck(shuffleArray(filteredCards));
      setCurrentIndex(0);
    } else {
      setCurrentIndex(nextIndex);
    }

    setAnswerState({
      selectedChoice: null,
      isCorrect: null,
    });
  };

  if (shuffledDeck.length === 0) {
    return <div className="quiz-feed loading">Loading questions...</div>;
  }

  const currentCard = shuffledDeck[currentIndex];

  return (
    <div className="quiz-feed">
      <div className="header-container">
        <button className="home-icon" onClick={() => navigate(-1)} aria-label="Go back">
          ← Back
        </button>
      </div>

      <QuizCard
        key={currentCard.id}
        card={currentCard}
        answerState={answerState}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />

      <div className="progress-indicator">
        {currentIndex + 1} / {shuffledDeck.length}
      </div>
    </div>
  );
}
