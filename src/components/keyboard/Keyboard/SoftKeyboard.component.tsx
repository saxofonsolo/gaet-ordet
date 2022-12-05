import React from "react";
import { View } from "react-native";
import { GameState, useGame } from "../../../hooks/game.hook";
import { SoftKeyboardKey } from "../KeyboardKey/SoftKeyboardKey.component";

interface SoftKeyboardProps {
    onPress: (key: string) => void;
}

export const SoftKeyboard = React.memo(
    ({ onPress }: SoftKeyboardProps): JSX.Element => {
        const {
            gameState,
            wordLength,
            guesses,
            currentGuess,
            editLetterIndex,
            getLetterState,
        } = useGame();
        const keys = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Æ", "Ø"],
            ["BS", "Z", "X", "C", "V", "B", "N", "M", "OK"],
        ];
        const currentWordLength = guesses[currentGuess]?.length || 0;

        return (
            <View
                style={{
                    paddingHorizontal: 2,
                    paddingBottom: 10,
                }}
            >
                {keys.map((keyRow, index) => (
                    <View key={index} style={{ flexDirection: "row" }}>
                        {keyRow.map((key) => {
                            const { isClose, isCorrect, isRedundant } =
                                getLetterState(key);
                            const disabled =
                                gameState !== GameState.Ongoing ||
                                (key === "BS" && currentWordLength === 0) ||
                                (key === "OK" &&
                                    currentWordLength < wordLength) ||
                                (key.length === 1 &&
                                    currentWordLength === wordLength &&
                                    editLetterIndex === -1);

                            return (
                                <SoftKeyboardKey
                                    key={key}
                                    value={key}
                                    onPress={onPress}
                                    disabled={disabled}
                                    isClose={isClose}
                                    isCorrect={isCorrect}
                                    isRedundant={isRedundant}
                                />
                            );
                        })}
                    </View>
                ))}
            </View>
        );
    },
);

SoftKeyboard.displayName = "SoftKeyboard";
