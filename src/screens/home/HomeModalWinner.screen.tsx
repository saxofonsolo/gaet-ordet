import React, { useCallback, useEffect, useRef } from "react";
import { Animated, Easing, Text, useColorScheme, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useGame } from "../../hooks/game.hook";
import { Button } from "../../components/elements/Button.component";
import { COLORS } from "../../constants/colors.constants";
import { WORD_GUESS_COUNT } from "../../constants/game.constants";
import { DICTIONARY } from "../../constants/dictionary.constants";
import { ScoreCalculation } from "../../components/ScoreCalculation.component";
import { Paragraph } from "../../components/elements/Paragraph.component";
import { logEvent } from "../../helpers/logEvent.helper";

export const HomeModalWinnerScreen = (): JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { targetWord, currentGuess, newGame, wordLength, difficulty } =
        useGame();
    const flagsArray = useRef(new Array(50).fill("")).current;
    const translateX1 = useRef(new Animated.Value(0));
    const translateX2 = useRef(new Animated.Value(0));
    const opacity1 = translateX1.current.interpolate({
        inputRange: [0, 900, 1000],
        outputRange: [1, 1, 0],
    });
    const opacity2 = translateX2.current.interpolate({
        inputRange: [0, 1100, 1200],
        outputRange: [1, 1, 0],
    });
    const isDarkMode = useColorScheme() === "dark";

    const onPressNewGame = useCallback(() => {
        newGame().then(() => navigation.goBack());
    }, [navigation, newGame]);

    useEffect(() => {
        logEvent("won", {
            targetWord,
            wordLength,
            difficulty,
            guesses: `${currentGuess + 1} / ${WORD_GUESS_COUNT}`,
        });
        Animated.stagger(100, [
            Animated.timing(translateX1.current, {
                toValue: 1000,
                delay: 200,
                duration: 3000,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(translateX2.current, {
                toValue: 1200,
                duration: 5000,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
        ]).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <View
            style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {flagsArray.map((_, index) => (
                <Animated.View
                    key={index}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: -20,
                        marginLeft: -20,
                        transform: [
                            { rotateZ: `${index * 7.2}deg` },
                            {
                                scale: Math.random() * (1.5 - 0.5 + 1) + 0.5,
                            },
                            {
                                translateX:
                                    index % 2
                                        ? translateX2.current
                                        : translateX1.current,
                            },
                        ],
                        opacity: index % 2 ? opacity2 : opacity1,
                    }}
                >
                    <Text
                        style={{
                            color: "#FFF",
                            fontSize: 40,
                        }}
                    >
                        🇩🇰
                    </Text>
                </Animated.View>
            ))}

            <View
                style={{
                    position: "relative",
                    backgroundColor: isDarkMode ? "#222" : COLORS.WHITE,
                    width: 320,
                    borderRadius: 5,
                }}
            >
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        backgroundColor: isDarkMode ? "#222" : COLORS.WHITE,
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        justifyContent: "center",
                        transform: [{ translateX: -50 }, { translateY: -50 }],
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 60,
                            lineHeight: 75,
                            textAlign: "center",
                        }}
                    >
                        {currentGuess === WORD_GUESS_COUNT - 1
                            ? "😅"
                            : currentGuess === WORD_GUESS_COUNT - 2
                            ? "😀"
                            : currentGuess === 0
                            ? "😲"
                            : "🤩"}
                    </Text>
                </View>

                <View
                    style={{
                        paddingTop: 50,
                        paddingBottom: 20,
                        paddingHorizontal: 20,
                    }}
                >
                    <Paragraph black align="center" size={30}>
                        {currentGuess === WORD_GUESS_COUNT - 1
                            ? DICTIONARY().game.won.phew
                            : currentGuess === WORD_GUESS_COUNT - 2
                            ? DICTIONARY().game.won.alright
                            : currentGuess === 0
                            ? DICTIONARY().game.won.wow
                            : DICTIONARY().game.won.congratulations}
                    </Paragraph>

                    <View style={{ marginVertical: 10 }}>
                        <Paragraph align="center" size={20}>
                            {DICTIONARY().game.won.youGuessed}
                        </Paragraph>
                        <Paragraph
                            bold
                            align="center"
                            size={20}
                            letterSpacing={1}
                        >
                            &quot;{targetWord}&quot;
                        </Paragraph>
                    </View>

                    <ScoreCalculation />

                    <Button
                        text={DICTIONARY().common.continue}
                        onPress={onPressNewGame}
                        style={{ marginTop: 10 }}
                    />
                </View>
            </View>
        </View>
    );
};
