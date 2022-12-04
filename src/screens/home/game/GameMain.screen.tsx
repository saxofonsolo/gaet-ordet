import React, { useCallback, useRef, useState } from "react";
import { LayoutRectangle, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { SoftKeyboard } from "../../../components/keyboard/SoftKeyboard.component";
import { GuessWord } from "../../../components/guesses/GuessWord.component";
import { Difficulty, useGame } from "../../../hooks/game.hook";
import { WORD_GUESS_COUNT } from "../../../constants/game.constants";

export const GameMainScreen = (): JSX.Element => {
    const toast = useToast();
    const {
        difficulty,
        wordLength,
        guessedLetters,
        closeLetters,
        guessStates,
        guesses,
        currentGuess,
        submitGuess,
        addLetter,
        backspace,
        gameTimer,
        editLetterIndex,
    } = useGame();
    const [guessWordLength, setGuessWordLength] = useState(wordLength);
    const [letterSize, setLetterSize] = useState(0);
    const guessLooper = useRef(Array(WORD_GUESS_COUNT).fill("")).current;

    const calculateSizes = useCallback(
        ({ height, width }: LayoutRectangle) => {
            const maxWidth = (width - 20) / wordLength;
            const maxHeight = (height - 20) / WORD_GUESS_COUNT;
            const maxSize = Math.floor(Math.min(maxWidth, maxHeight));
            setLetterSize(maxSize);
            setGuessWordLength(wordLength);
        },
        [wordLength],
    );

    const handleKeyPress = useCallback(
        (key: string) => {
            const newGuesses = [...guesses];
            const guessSoFar = newGuesses[currentGuess] || "";
            const guessSoFarLength = guessSoFar.length;

            if (key === "BS") {
                // Remove letter from current guess
                backspace();
            } else if (key === "OK") {
                // Submit guess
                if (guessSoFarLength === wordLength) {
                    if (difficulty >= Difficulty.Hard) {
                        // Check for already guessed letters
                        const missedCorrectLetter = guessedLetters.reduce(
                            (previous, current, index) =>
                                current && previous < 0
                                    ? current !== guessSoFar[index]
                                        ? index
                                        : previous
                                    : previous,
                            -1,
                        );
                        if (missedCorrectLetter > -1) {
                            toast.show(
                                `${
                                    missedCorrectLetter + 1
                                }. bogstav skal være ${
                                    guessedLetters[missedCorrectLetter]
                                }`,
                                {
                                    type: "warning",
                                    placement: "top",
                                },
                            );
                            return;
                        }

                        const missedCloseLetters = guessSoFar
                            .split("")
                            .reduce((previous, current) => {
                                const currentIndex = previous.indexOf(current);
                                if (currentIndex > -1) {
                                    previous.splice(currentIndex, 1);
                                }
                                return previous;
                            }, closeLetters);
                        if (missedCloseLetters.length) {
                            toast.show(
                                `Ordet mangler et ${missedCloseLetters[0]}`,
                                {
                                    type: "warning",
                                    placement: "top",
                                },
                            );
                            return;
                        }
                    }

                    submitGuess(guessSoFar).catch(() => {
                        toast.show("Ordet findes ikke i ordlisten", {
                            type: "warning",
                            placement: "top",
                        });
                    });
                } else {
                    toast.show("Ordet er for kort", {
                        type: "warning",
                        placement: "top",
                    });
                }
            } else if (guessSoFarLength < wordLength || editLetterIndex > -1) {
                // Add letter to current guess
                addLetter(key);

                if (currentGuess === 0 && guessSoFarLength === 0) {
                    gameTimer.start();
                }
            }
        },
        [
            guesses,
            currentGuess,
            wordLength,
            backspace,
            difficulty,
            submitGuess,
            guessedLetters,
            closeLetters,
            toast,
            addLetter,
            gameTimer,
            editLetterIndex,
        ],
    );

    return (
        <View
            style={{
                height: "100%",
                justifyContent: "space-between",
            }}
        >
            <View
                key={wordLength}
                style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10 }}
                onLayout={(event) => calculateSizes(event.nativeEvent.layout)}
            >
                {guessLooper.map((_, i) => (
                    <GuessWord
                        key={i}
                        word={guesses[i]}
                        letterStates={guessStates[i]}
                        isCurrent={i === currentGuess}
                        letterSize={letterSize}
                        length={guessWordLength}
                    />
                ))}
            </View>

            <View style={{ alignSelf: "flex-end" }}>
                <SoftKeyboard onPress={handleKeyPress} />
            </View>
        </View>
    );
};
