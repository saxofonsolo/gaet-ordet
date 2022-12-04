import React from "react";
import { View } from "react-native";
import { GameState, useGame } from "../../hooks/game.hook";
import { SoftKeyboardKey } from "./SoftKeyboardKey.component";

interface SoftKeyboardProps {
    onPress: (key: string) => void;
}

export const SoftKeyboard = React.memo(
    ({ onPress }: SoftKeyboardProps): JSX.Element => {
        const { gameState } = useGame();
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
                        {keyRow.map((key) => (
                            <SoftKeyboardKey
                                key={key}
                                value={key}
                                onPress={onPress}
                                disabled={gameState !== GameState.Ongoing}
                            />
                        ))}
                    </View>
                ))}
            </View>
        );
    },
);

SoftKeyboard.displayName = "SoftKeyboard";
