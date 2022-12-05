import React from "react";
import { View } from "react-native";
import { useGame } from "../../../hooks/game.hook";
import { SoftKeyboardKey } from "../KeyboardKey/SoftKeyboardKey.component";

interface SoftKeyboardProps {
    onPress: (key: string) => void;
}

export const SoftKeyboard = React.memo(
    ({ onPress }: SoftKeyboardProps): JSX.Element => {
        const { getKeyState } = useGame();
        const keys = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Å"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Æ", "Ø"],
            ["BS", "Z", "X", "C", "V", "B", "N", "M", "OK"],
        ];

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
                            const {
                                isClose,
                                isCorrect,
                                isRedundant,
                                disabled,
                                forbidden,
                            } = getKeyState(key);

                            return (
                                <SoftKeyboardKey
                                    key={key}
                                    value={key}
                                    onPress={onPress}
                                    disabled={disabled}
                                    forbidden={forbidden}
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
