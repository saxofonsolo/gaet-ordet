import React, { useCallback } from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";
import CoinSvg from "../../graphics/coin.svg";
import { DICTIONARY } from "../../constants/dictionary.constants";
import { useScore } from "../../hooks/score.hook";
import { Paragraph } from "../elements/Paragraph.component";
import { formatNumber } from "../../helpers/formatNumber.helper";
import { useGame } from "../../hooks/game.hook";

export const GameHeader = (): JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { totalScore, score } = useScore();
    const { currentGuess } = useGame();
    const isDarkMode = useColorScheme() === "dark";

    const showGiveUpModal = useCallback(
        () =>
            navigation.navigate({
                name: SCREEN_NAMES.home.modalGiveUp,
                params: {},
            }),
        [navigation],
    );

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
                <Paragraph bold style={{ marginLeft: 10 }}>
                    {formatNumber(totalScore)}
                    {score > 0 && "  +  " + formatNumber(score)}
                </Paragraph>
            </View>
            <View>
                <Pressable
                    disabled={currentGuess <= 1}
                    onPress={showGiveUpModal}
                    accessibilityRole="button"
                    style={{
                        padding: 10,
                        paddingHorizontal: 15,
                        opacity: currentGuess <= 1 ? 0 : 1,
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
