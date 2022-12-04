import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getRandomFromArray } from "../helpers/getRandomFromArray.helper";
import { FIVE_LETTER_WORDS } from "../constants/words/fiveLetterWords.constant";
import { SIX_LETTER_WORDS } from "../constants/words/sixLetterWords.constant";
import { SEVEN_LETTER_WORDS } from "../constants/words/sevenLetterWords.constant";
import { LetterState } from "../interfaces/LetterState.interface";
import { compareWords } from "../helpers/compareWords.helper";
import {
    DEFAULT_LETTER_STATE,
    WORD_GUESS_COUNT,
} from "../constants/game.constants";
import { SCREEN_NAMES } from "../constants/screenNames.constants";
import { logEvent } from "../helpers/logEvent.helper";
import { useAppData } from "./appData.hook";
import { useScore } from "./score.hook";

export enum GameState {
    None,
    Ongoing,
    GaveUp,
    Lost,
    Won,
}

export enum Difficulty {
    Normal,
    Hard,
    Expert,
}

export enum WordLength {
    Five = 5,
    Six = 6,
    Seven = 7,
}

export interface GameOptions {
    targetWord?: string;
    difficulty: Difficulty;
    wordLength: WordLength;
}

interface GameHook {
    newGame: (options?: GameOptions) => Promise<void>;
    giveUp: () => Promise<void>;
    gameState: GameState;
    submitGuess: (word: string) => Promise<void>;
    difficulty: Difficulty;
    targetWord: string;
    wordLength: WordLength;
    getLetterState: (letter: string) => LetterState;
    guessStates: LetterState[][];
    currentGuess: number;
    guesses: string[];
    guessedLetters: string[];
    closeLetters: string[];
    previousCloseLetters: string[][];
    editLetterIndex: number;
    setEditLetterIndex: Dispatch<SetStateAction<number>>;
    winsInARow: number;
    addLetter: (letter: string) => void;
    backspace: () => void;
    gameTimer: {
        start: () => void;
        stop: () => void;
        result: number | undefined;
    };
}

const GameContext = React.createContext<GameHook>({
    newGame: () => Promise.resolve(),
    giveUp: () => Promise.resolve(),
    gameState: GameState.None,
    submitGuess: () => Promise.reject(),
    difficulty: Difficulty.Normal,
    targetWord: "",
    wordLength: WordLength.Five,
    getLetterState: () => DEFAULT_LETTER_STATE,
    guessStates: [],
    currentGuess: 0,
    guesses: [],
    guessedLetters: [],
    closeLetters: [],
    previousCloseLetters: [],
    editLetterIndex: -1,
    setEditLetterIndex: () => null,
    winsInARow: 0,
    addLetter: () => null,
    backspace: () => null,
    gameTimer: {
        start: () => null,
        stop: () => null,
        result: undefined,
    },
});

type Props = {
    children: React.ReactNode;
};

export const GameProvider = ({ children }: Props): JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { settings } = useAppData();
    const [difficulty, setDifficulty] = useState<Difficulty>(
        settings.get.difficulty || Difficulty.Normal,
    );
    const [gameState, setGameState] = useState(GameState.None);
    const [gameStartTime, setGameStartTime] = useState<number>();
    const [gameTime, setGameTime] = useState<number>();
    const [wordLength, setWordLength] = useState<WordLength>(
        settings.get.wordLength || WordLength.Five,
    );
    const [targetWord, setTargetWord] = useState("");
    const [previousWords, setPreviousWords] = useState<string[]>([]);
    const [guessStates, setGuessStates] = useState<LetterState[][]>([]);
    const [currentGuess, setCurrentGuess] = useState(0);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
    const [winsInARow, setWinsInARow] = useState(0);
    const [closeLetters, setCloseLetters] = useState<string[]>([]);
    const [previousCloseLetters, setPreviousCloseLetters] = useState<
        string[][]
    >([]);
    const [allLetterStates, setAllLetterStates] = useState<
        Record<string, LetterState>
    >({});
    const [editLetterIndex, setEditLetterIndex] = useState(-1);
    const { updateScore, resetScore } = useScore();
    const getWordList = (length: WordLength) =>
        length === WordLength.Seven
            ? SEVEN_LETTER_WORDS
            : length === WordLength.Six
            ? SIX_LETTER_WORDS
            : FIVE_LETTER_WORDS;

    const newGame = useCallback(
        (gameOptions?: GameOptions) =>
            new Promise<void>((resolve) => {
                const {
                    targetWord: tempTargetWord,
                    difficulty: tempDifficulty,
                    wordLength: tempWordLength,
                } = gameOptions || {};
                const newDifficulty =
                    typeof tempDifficulty === "number"
                        ? tempDifficulty
                        : difficulty || Difficulty.Normal;
                const newWordLength =
                    typeof tempWordLength === "number"
                        ? tempWordLength
                        : wordLength || WordLength.Five;
                const wordList = getWordList(newWordLength);
                let newWord =
                    tempTargetWord ||
                    getRandomFromArray(wordList, previousWords);

                if (newWord) {
                    // Found a random word - success!
                    const newPreviousWords = [
                        ...new Set([...previousWords, targetWord]),
                    ];
                    setPreviousWords(newPreviousWords);
                } else {
                    // Didn't find a random word, because all words have been
                    // used previously. Reset array with previous words and find
                    // a new random word.
                    const newPreviousWords = [targetWord];
                    newWord = getRandomFromArray(wordList, newPreviousWords);
                    setPreviousWords(newPreviousWords);
                }

                console.log(newWord);
                setTargetWord(newWord);

                // Set settings from options
                setDifficulty(newDifficulty);
                setWordLength(newWordLength);
                settings
                    .set({
                        difficulty: newDifficulty,
                        wordLength: newWordLength,
                    })
                    .catch(() => {
                        logEvent("error", {
                            message: "Settings couldn't be stored",
                        });
                    });

                // Reset last states from last game
                setGuesses([]);
                setCurrentGuess(0);
                setGuessStates([]);
                setGuessedLetters(new Array(wordLength).fill(""));
                setCloseLetters([]);
                setPreviousCloseLetters(new Array(wordLength).fill([]));
                setAllLetterStates({});
                setGameState(GameState.Ongoing);
                setGameStartTime(undefined);
                setGameTime(undefined);
                resetScore();

                logEvent("new_game", {
                    targetWord: newWord,
                    wordLength,
                    difficulty,
                });

                resolve();
            }),
        [
            targetWord,
            difficulty,
            wordLength,
            previousWords,
            resetScore,
            settings,
        ],
    );

    const giveUp = useCallback(
        () =>
            new Promise<void>((resolve) => {
                setGameState(GameState.GaveUp);
                resolve();
            }),
        [],
    );

    const gameTimer = useMemo(
        () => ({
            start: () => {
                if (!gameStartTime) {
                    setGameStartTime(Date.now());
                }
            },
            stop: () => {
                if (!gameTime && gameStartTime) {
                    const newGameTime = Date.now() - gameStartTime;
                    setGameTime(newGameTime);
                    return newGameTime;
                }
                return gameTime;
            },
            result: gameTime,
        }),
        [gameTime, gameStartTime],
    );

    const showLoserModal = useCallback(
        (): void =>
            navigation.navigate({
                name: SCREEN_NAMES.HOME.MODAL_LOSER,
                params: {},
            }),
        [navigation],
    );

    const showWinnerModal = useCallback(
        (): void =>
            navigation.navigate({
                name: SCREEN_NAMES.HOME.MODAL_WINNER,
                params: {},
            }),
        [navigation],
    );

    const submitGuess = useCallback(
        (guess: string) =>
            new Promise<void>((resolve, reject) => {
                if (getWordList(wordLength).includes(guess)) {
                    const letterStates = compareWords(guess, targetWord);
                    const newAllLetterStates = { ...allLetterStates };
                    const newCloseLetters: string[] = [];
                    const newPreviousCloseLetters = [...previousCloseLetters];

                    // Update the array of all letter states
                    guess.split("").forEach((letter, index) => {
                        if (typeof newAllLetterStates[letter] === "undefined") {
                            // Add new letter state
                            newAllLetterStates[letter] = {
                                ...letterStates[index],
                            };
                        } else if (letterStates[index].isCorrect) {
                            // Update existing letter state
                            newAllLetterStates[letter].isClose = false;
                            newAllLetterStates[letter].isCorrect = true;
                            newAllLetterStates[letter].isRedundant = false;
                        }

                        if (letterStates[index].isClose) {
                            newCloseLetters.push(letter);
                        }

                        if (newAllLetterStates[letter].isClose) {
                            newPreviousCloseLetters[index] = [
                                ...newPreviousCloseLetters[index],
                                letter,
                            ];
                        }
                    });

                    setAllLetterStates(newAllLetterStates);

                    // Update array of close letters
                    setCloseLetters(newCloseLetters);
                    setPreviousCloseLetters(newPreviousCloseLetters);

                    // Update array of guessed letters
                    const newGuessedLetters = [...guessedLetters];
                    letterStates.forEach(({ isCorrect }, index) => {
                        if (isCorrect) {
                            newGuessedLetters[index] = guess[index];
                        }
                    });
                    setGuessedLetters(newGuessedLetters);

                    // Update guess states
                    const newGuessStates = [...guessStates];
                    newGuessStates[currentGuess] = letterStates;
                    setGuessStates(newGuessStates);
                    updateScore(difficulty, letterStates);

                    // Update game state
                    if (guess === targetWord) {
                        gameTimer.stop();
                        setGameState(GameState.Won);
                        setWinsInARow(winsInARow + 1);
                        setTimeout(showWinnerModal, 1500);
                    } else {
                        if (currentGuess === WORD_GUESS_COUNT - 1) {
                            gameTimer.stop();
                            setGameState(GameState.Lost);
                            setWinsInARow(0);
                            setTimeout(showLoserModal, 1500);
                        } else {
                            setCurrentGuess(
                                Math.min(WORD_GUESS_COUNT, currentGuess + 1),
                            );
                        }
                    }

                    logEvent("guess", {
                        targetWord,
                        guess,
                        wordLength,
                        difficulty,
                    });

                    // Done! :)
                    resolve();
                } else {
                    reject();
                }
            }),
        [
            wordLength,
            targetWord,
            allLetterStates,
            previousCloseLetters,
            guessedLetters,
            guessStates,
            currentGuess,
            updateScore,
            difficulty,
            gameTimer,
            winsInARow,
            showWinnerModal,
            showLoserModal,
        ],
    );

    const addLetter = useCallback(
        (letter: string) => {
            const newGuesses = [...guesses];
            const guessSoFar = newGuesses[currentGuess] || "";

            if (editLetterIndex === -1) {
                // Add letter to current guess
                newGuesses[currentGuess] = guessSoFar + letter;
            } else {
                // Edit letter
                newGuesses[currentGuess] =
                    guessSoFar.substring(0, editLetterIndex) +
                    letter +
                    guessSoFar.substring(editLetterIndex + 1);
                setEditLetterIndex(-1);
            }

            setGuesses(newGuesses);
        },
        [guesses, currentGuess, editLetterIndex],
    );

    const backspace = useCallback(() => {
        // Remove letter from current guess
        const newGuesses = [...guesses];
        const guessSoFar = newGuesses[currentGuess] || "";

        if (editLetterIndex > -1) {
            // Remove certain character
            newGuesses[currentGuess] =
                guessSoFar.substring(0, editLetterIndex) +
                guessSoFar.substring(editLetterIndex + 1);
            setEditLetterIndex(-1);
        } else {
            // Remove last character
            newGuesses[currentGuess] = guessSoFar.slice(0, -1);
        }
        setGuesses(newGuesses);
    }, [guesses, currentGuess, editLetterIndex]);

    const getLetterState = useCallback(
        (letter: string): LetterState => {
            return allLetterStates[letter] || DEFAULT_LETTER_STATE;
        },
        [allLetterStates],
    );

    useEffect(() => {
        void newGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <GameContext.Provider
            value={{
                newGame,
                giveUp,
                gameState,
                submitGuess,
                difficulty,
                targetWord,
                wordLength,
                getLetterState,
                guessStates,
                currentGuess,
                guesses,
                guessedLetters,
                closeLetters,
                previousCloseLetters,
                editLetterIndex,
                setEditLetterIndex,
                winsInARow,
                addLetter,
                backspace,
                gameTimer,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export const useGame = (): GameHook => React.useContext(GameContext);
