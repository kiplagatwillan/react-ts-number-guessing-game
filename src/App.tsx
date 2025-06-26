import React, { useReducer } from "react";
interface GameState {
  secretNumber: number;
  trials: number;
  feedback: string;
  gameActive: boolean;
  inputValue: string;
  previousGuess: number | null;
  scorePercentage: number | null;
}
type GameAction =
  | { type: "START_GAME" }
  | { type: "SET_INPUT"; value: string }
  | { type: "SUBMIT_GUESS" };
const calculateScore = (trialsUsed: number): number => {
  const scores = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  return trialsUsed <= scores.length ? scores[trialsUsed - 1] : 0;
};

const initialState: GameState = {
  secretNumber: Math.floor(Math.random() * 101),
  trials: 10,
  feedback: "",
  gameActive: false,
  inputValue: "",
  previousGuess: null,
  scorePercentage: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        secretNumber: Math.floor(Math.random() * 101),
        trials: 10,
        feedback: "Secret number generated. Good luck guessing it!",
        gameActive: true,
        inputValue: "",
        previousGuess: null,
        scorePercentage: null,
      };

    case "SET_INPUT":
      return {
        ...state,
        inputValue: action.value,
      };

    case "SUBMIT_GUESS":
      if (!state.gameActive || state.inputValue.trim() === "") return state;

      const guess = parseInt(state.inputValue);
      if (isNaN(guess)) {
        return {
          ...state,
          feedback: "Please enter a valid number",
        };
      }

      if (guess < 0 || guess > 100) {
        return {
          ...state,
          feedback: "Number must be between 0 and 100",
        };
      }

      const newTrials = state.trials - 1;
      const trialsUsed = 10 - newTrials;

      if (guess === state.secretNumber) {
        const score = calculateScore(trialsUsed);
        return {
          ...state,
          trials: newTrials,
          feedback: `Congratulations! ${state.secretNumber} is correct!`,
          gameActive: false,
          previousGuess: guess,
          scorePercentage: score,
        };
      }

      if (newTrials <= 0) {
        return {
          ...state,
          trials: 0,
          feedback: `Game over! The number was ${state.secretNumber}`,
          gameActive: false,
          previousGuess: guess,
          scorePercentage: 0,
        };
      }

      return {
        ...state,
        trials: newTrials,
        feedback: `${guess} IS ${guess > state.secretNumber ? "GREATER" : "LESS"} THAN THE SECRET NUMBER`,
        inputValue: "",
        previousGuess: guess,
      };

    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_INPUT", value: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT_GUESS" });
  };

  const handleNewGame = () => {
    dispatch({ type: "START_GAME" });
  };

  return (
    <div className="game-container">
      <div className="game-card">
        {/* Header */}
        <div className="game-header">
          <h1 className="game-title">GUESS A NUMBER BETWEEN 0 AND 100</h1>
          <div className="trials-display">{state.trials} TRIALS REMAINING</div>
        </div>

        <div className="input-section">
          <div className="input-container">
            <input
              type="number"
              value={state.inputValue}
              onChange={handleInputChange}
              disabled={!state.gameActive}
              className="guess-input"
              placeholder="00"
              min="0"
              max="100"
            />
            <div className="input-display">
              {state.previousGuess !== null ? state.previousGuess : "00"}
            </div>
          </div>
        </div>

        <div className="feedback-section">
          <p className="feedback-text">{state.feedback}</p>

          {state.scorePercentage !== null && state.scorePercentage > 0 && (
            <div className="score-display">
              <div className="score-label">YOUR SCORE:</div>
              <div className="score-percentage">{state.scorePercentage}%</div>
            </div>
          )}
        </div>
        <div className="controls">
          <button
            onClick={handleSubmit}
            disabled={!state.gameActive}
            className="guess-btn"
          >
            GUESS
          </button>
          <button onClick={handleNewGame} className="newgame-btn">
            NEW GAME
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
