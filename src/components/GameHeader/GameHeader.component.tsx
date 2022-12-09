import React from "react";
import { Pressable, useColorScheme, View } from "react-native";
import CoinSvg from "../../graphics/coin.svg";
import { DICTIONARY } from "../../constants/dictionary.constants";
import { Paragraph } from "../elements/Paragraph.component";
import { formatNumber } from "../../helpers/formatNumber.helper";

interface GameHeaderProps {
    score: number;
    totalScore: number;
    currentGuess: number;
    onGiveUp: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = (props) => {
    const isDarkMode = useColorScheme() === "dark";

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: isDarkMode ? "#171717" : "#eee",
            }}
        >
            <View
                style={{
                    padding: 10,
                    paddingHorizontal: 15,
                    flexDirection: "row",
                    alignItems: "center",
                }}
            >
                <CoinSvg width={20} height={20} />
                {props.totalScore >= 0 && (
                    <Paragraph bold style={{ marginLeft: 10 }}>
                        {formatNumber(props.totalScore)}
                        {props.score > 0 && "  +  " + formatNumber(props.score)}
                    </Paragraph>
                )}
            </View>
            <View>
                <Pressable
                    disabled={props.currentGuess <= 1}
                    onPress={props.onGiveUp}
                    accessibilityRole="button"
                    style={{
                        padding: 10,
                        paddingHorizontal: 15,
                        opacity: props.currentGuess <= 1 ? 0 : 1,
                    }}
                >
                    <Paragraph bold>
                        {DICTIONARY().game.giveUp.title} 💩
                    </Paragraph>
                </Pressable>
            </View>
        </View>
    );
};
