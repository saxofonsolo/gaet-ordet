import React, { useCallback, useEffect, useRef, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { KeyState } from "../interfaces/LetterState.interface";
import { SCORE, TIME_BONUS_HALF_LIFE } from "../constants/score.constants";
import { Difficulty } from "./game.hook";
import { useAppData } from "./appData.hook";

interface ScoreHook {
    score: number;
    totalScore: number;
    updateScore: (difficulty: Difficulty, letterStates: KeyState[]) => void;
    resetScore: () => void;
    addBonus: (bonus: number) => void;
    addScoreToTotal: (bonus: number, winsInARow: number) => void;
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
    const { userId } = useAppData();
    const [score, setScore] = useState(0);
    const [totalScore, setTotalScore] = useState(-1);
    const difficultyMultipliers = useRef(Object.values(SCORE.difficulty));
    const userDoc = firestore().collection("users").doc(userId);

    const updateScore = useCallback(
        (difficulty: Difficulty, letterStates: KeyState[]) => {
            const newScore = letterStates.reduce(
                (accumulated, { isClose, isCorrect }) =>
                    accumulated +
                    (isCorrect
                        ? SCORE.letters.correct
                        : isClose
                        ? SCORE.letters.close
                        : SCORE.letters.redundant) *
                        difficultyMultipliers.current[difficulty],
                score,
            );

            setScore(newScore);
        },
        [score],
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
                    difficultyMultipliers.current[difficulty],
            ),
        [],
    );

    const getSpotsLeftBonus = useCallback(
        (difficulty: Difficulty, spotsLeft: number) =>
            Math.round(
                spotsLeft *
                    SCORE.bonuses.remaining *
                    difficultyMultipliers.current[difficulty],
            ),
        [],
    );

    const getWinsInARowBonus = useCallback(
        (difficulty: Difficulty, winsInARow: number) =>
            Math.round(
                Math.min(
                    SCORE.bonuses.winsInARow,
                    SCORE.bonuses.winsInARow * 2 ** ((winsInARow - 1) / 9) -
                        SCORE.bonuses.winsInARow,
                ) * difficultyMultipliers.current[difficulty],
            ),
        [],
    );

    const addScoreToTotal = useCallback(
        (bonus = 0, winsInARow = 0) => {
            const newTotalScore = totalScore + score + bonus;
            setTotalScore(newTotalScore);
            setScore(0);
            userDoc
                .get()
                .then((doc) => {
                    const currentState = doc.data();
                    userDoc
                        .set(
                            {
                                totalScore: Math.max(
                                    currentState?.totalScore || 0,
                                    newTotalScore,
                                ),
                                currentStreak: winsInARow,
                                maxStreak: Math.max(
                                    currentState?.maxStreak || 0,
                                    winsInARow,
                                ),
                                lastActivity:
                                    firestore.FieldValue.serverTimestamp(),
                            },
                            { merge: true },
                        )
                        .catch((err) => console.log(111, err));
                })
                .catch((err) => console.log(222, err));
        },
        [totalScore, score, userDoc],
    );

    useEffect(() => {
        userDoc
            .get()
            .then((doc) => {
                const { totalScore: retrievedScore } = doc.data() as any;
                setTotalScore(retrievedScore || 0);
            })
            .catch(() => setTotalScore(0));
    }, [userDoc]);

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
