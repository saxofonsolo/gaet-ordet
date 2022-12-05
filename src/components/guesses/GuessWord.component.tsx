import React from "react";
import { View } from "react-native";
import { useGame, WordLength } from "../../hooks/game.hook";
import { KeyState } from "../../interfaces/LetterState.interface";
import { GuessLetter } from "./GuessLetter.component";

interface GuessWordProps {
    word?: string;
    length: WordLength;
    isCurrent?: boolean;
    letterStates?: KeyState[];
    letterSize: number;
}

export const GuessWord = React.memo(
    ({
        word,
        length = WordLength.Five,
        isCurrent,
        letterStates,
        letterSize,
    }: GuessWordProps): JSX.Element => {
        const {
            targetWord,
            guessedLetters,
            editLetterIndex,
            setEditLetterIndex,
        } = useGame();

        return (
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                {Array.from(Array(length), (_, i) => {
                    return (
                        <GuessLetter
                            key={`${targetWord}-${i}`}
                            size={letterSize}
                            letter={word ? word[i] || "" : ""}
                            letterIndex={i}
                            isCurrent={isCurrent}
                            isClose={
                                letterStates
                                    ? letterStates[i].isClose || false
                                    : false
                            }
                            isCorrect={
                                letterStates
                                    ? letterStates[i].isCorrect || false
                                    : false
                            }
                            isRedundant={
                                letterStates
                                    ? letterStates[i].isRedundant || false
                                    : false
                            }
                            previouslyGuessed={
                                !!guessedLetters[i] &&
                                guessedLetters[i] === (word || [])[i]
                            }
                            onPress={() => {
                                setEditLetterIndex((cur) =>
                                    cur === i ? -1 : i,
                                );
                            }}
                            isInEditMode={editLetterIndex === i && isCurrent}
                        />
                    );
                })}
            </View>
        );
    },
);

GuessWord.displayName = "GuessWord";
