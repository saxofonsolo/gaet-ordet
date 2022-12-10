import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { useScore } from "../hooks/score.hook";
import { GameState, useGame } from "../hooks/game.hook";
import CoinSvg from "../graphics/coin.svg";
import { COLORS } from "../constants/colors.constants";
import { formatNumber } from "../helpers/formatNumber.helper";
import { DICTIONARY } from "../constants/dictionary.constants";
import { WORD_GUESS_COUNT } from "../constants/game.constants";
import { useTheme } from "../hooks/theme.hook";
import { Paragraph } from "./elements/Paragraph.component";

export const ScoreCalculation = (): JSX.Element => {
    const {
        gameTimer,
        currentGuess,
        wordLength,
        difficulty,
        gameState,
        winsInARow,
    } = useGame();
    const {
        getTimeBonus,
        getSpotsLeftBonus,
        getWinsInARowBonus,
        score,
        totalScore,
        addScoreToTotal,
    } = useScore();
    const scoreBefore = useRef(score).current;
    const totalScoreBefore = useRef(totalScore).current;
    const { isDarkMode } = useTheme();

    const timeBonus = useRef(
        gameState === GameState.Won
            ? gameTimer.result
                ? getTimeBonus(difficulty, gameTimer.result)
                : 0
            : 0,
    ).current;

    const spotsLeft = useRef(
        (WORD_GUESS_COUNT - (currentGuess + 1)) * wordLength,
    ).current;
    const spotsLeftBonus = useRef(
        gameState === GameState.Won
            ? gameTimer.result
                ? getSpotsLeftBonus(difficulty, spotsLeft)
                : 0
            : 0,
    ).current;

    const winsInARowBonus = useRef(
        gameState === GameState.Won
            ? gameTimer.result
                ? getWinsInARowBonus(difficulty, winsInARow)
                : 0
            : 0,
    ).current;

    const subtotal = scoreBefore + timeBonus + spotsLeftBonus + winsInARowBonus;
    const total = totalScoreBefore + subtotal;

    useEffect(() => {
        addScoreToTotal(
            timeBonus + spotsLeftBonus + winsInARowBonus,
            winsInARow,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View
            style={{
                marginVertical: 5,
                padding: 10,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: COLORS.ORANGE,
                borderRadius: 5,
            }}
        >
            <View style={{ paddingRight: 10, alignSelf: "flex-end" }}>
                <CoinSvg width={20} height={20} />
            </View>

            <View style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Paragraph size={14} bold>
                        {DICTIONARY().score.yourGuesses}
                    </Paragraph>
                    <Paragraph size={14}>{formatNumber(scoreBefore)}</Paragraph>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Paragraph size={14} bold>
                        {DICTIONARY().score.timeBonus}
                    </Paragraph>
                    <Paragraph size={14}>{formatNumber(timeBonus)}</Paragraph>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Paragraph size={14} bold>
                        {DICTIONARY({ n: spotsLeft }).score.spotsLeft}
                    </Paragraph>
                    <Paragraph size={14}>
                        {formatNumber(spotsLeftBonus)}
                    </Paragraph>
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Paragraph size={14} bold>
                        {
                            DICTIONARY({ n: winsInARow < 2 ? 0 : winsInARow })
                                .score.winsInARow
                        }
                    </Paragraph>
                    <Paragraph size={14}>
                        {formatNumber(winsInARowBonus)}
                    </Paragraph>
                </View>

                <View
                    style={{
                        marginTop: 6,
                        paddingTop: 3,
                        borderTopWidth: 1,
                        borderStyle: "dashed",
                        borderColor: isDarkMode ? COLORS.WHITE : COLORS.BLACK,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Paragraph bold size={14}>
                        {DICTIONARY().score.subtotal}
                    </Paragraph>
                    <Paragraph size={14}>{formatNumber(subtotal)}</Paragraph>
                </View>
                <View
                    style={{
                        marginTop: 6,
                        paddingTop: 3,
                        borderTopWidth: 1,
                        borderColor: isDarkMode ? COLORS.WHITE : COLORS.BLACK,
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Paragraph bold>{DICTIONARY().score.total}</Paragraph>
                    <Paragraph bold>{formatNumber(total)}</Paragraph>
                </View>
            </View>
        </View>
    );
};
