import React, { useCallback, useEffect, useRef, useState } from "react";
import { LetterState } from "../interfaces/LetterState.interface";
import { SCORE, TIME_BONUS_HALF_LIFE } from "../constants/score.constants";
import { Difficulty } from "./game.hook";
import { useAppData } from "./appData.hook";

interface ScoreHook {
    score: number;
    totalScore: number;
    updateScore: (difficulty: Difficulty, letterStates: LetterState[]) => void;
    resetScore: () => void;
    addBonus: (bonus: number) => void;
    addScoreToTotal: (bonus?: number) => void;
    getTimeBonus: (difficulty: Difficulty, ms: number) => number;
    getSpotsLeftBonus: (difficulty: Difficulty, spotsLeft: number) => number;
    getWinsInARowBonus: (difficulty: Difficulty, winsInARow: number) => number;
}

const ScoreContext = React.createContext<ScoreHook>({
    score: 0,
    totalScore: 0,
    updateScore: () => null,
    resetScore: () => null,
    addBonus: () => null,
    addScoreToTotal: () => null,
    getTimeBonus: () => 0,
    getSpotsLeftBonus: () => 0,
    getWinsInARowBonus: () => 0,
});

type Props = {
    children: React.ReactNode;
};

export const ScoreProvider = ({ children }: Props): JSX.Element => {
    const { settings } = useAppData();
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(settings.get.totalScore || 0);
    const difficultyMultipliers = useRef(
        Object.values(SCORE.difficulty),
    ).current;

    const updateScore = useCallback(
        (difficulty: Difficulty, letterStates: LetterState[]) => {
            const newScore = letterStates.reduce(
                (accumulated, { isClose, isCorrect }) =>
                    accumulated +
                    (isCorrect
                        ? SCORE.letters.correct
                        : isClose
                        ? SCORE.letters.close
                        : SCORE.letters.redundant) *
                        difficultyMultipliers[difficulty],
                score,
            );

            setScore(newScore);
        },
        [score, difficultyMultipliers],
    );

    const resetScore = useCallback(() => setScore(0), []);

    const addBonus = useCallback(
        (bonus: number) => setTotalScore(totalScore + bonus),
        [setTotalScore, totalScore],
    );

    const getTimeBonus = useCallback(
        (difficulty: Difficulty, ms: number) =>
            Math.round(
                SCORE.bonuses.time *
                    0.5 ** (ms / TIME_BONUS_HALF_LIFE) *
                    difficultyMultipliers[difficulty],
            ),
        [difficultyMultipliers],
    );

    const getSpotsLeftBonus = useCallback(
        (difficulty: Difficulty, spotsLeft: number) =>
            Math.round(
                spotsLeft *
                    SCORE.bonuses.remaining *
                    difficultyMultipliers[difficulty],
            ),
        [difficultyMultipliers],
    );

    const getWinsInARowBonus = useCallback(
        (difficulty: Difficulty, winsInARow: number) =>
            Math.round(
                Math.min(
                    SCORE.bonuses.winsInARow,
                    SCORE.bonuses.winsInARow * 2 ** ((winsInARow - 1) / 9) -
                        SCORE.bonuses.winsInARow,
                ) * difficultyMultipliers[difficulty],
            ),
        [difficultyMultipliers],
    );

    const addScoreToTotal = useCallback(
        (bonus = 0) => {
            setTotalScore(totalScore + score + bonus);
            setScore(0);
        },
        [totalScore, score],
    );

    useEffect(() => {
        if (totalScore && totalScore !== settings.get.totalScore) {
            void settings.set({ totalScore });
        }
    }, [settings, totalScore]);

    return (
        <ScoreContext.Provider
            value={{
                score,
                totalScore,
                updateScore,
                resetScore,
                addBonus,
                addScoreToTotal,
                getTimeBonus,
                getSpotsLeftBonus,
                getWinsInARowBonus,
            }}
        >
            {children}
        </ScoreContext.Provider>
    );
};

export const useScore = (): ScoreHook => React.useContext(ScoreContext);
