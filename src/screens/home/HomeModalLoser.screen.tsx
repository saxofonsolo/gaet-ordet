import React, { useCallback, useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GameState, useGame } from "../../hooks/game.hook";
import { Button } from "../../components/elements/Button.component";
import { COLORS } from "../../constants/colors.constants";
import { DICTIONARY } from "../../constants/dictionary.constants";
import { ScoreCalculation } from "../../components/ScoreCalculation.component";
import { Paragraph } from "../../components/elements/Paragraph.component";
import { WORD_GUESS_COUNT } from "../../constants/game.constants";
import { logEvent } from "../../helpers/logEvent.helper";

export const HomeModalLoserScreen = (): JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const {
        targetWord,
        newGame,
        gameState,
        currentGuess,
        wordLength,
        difficulty,
    } = useGame();
    const skullsArray = useRef(new Array(50).fill("")).current;
    const translateY1 = useRef(new Animated.Value(0));
    const translateY2 = useRef(new Animated.Value(0));
    const opacity1 = translateY1.current.interpolate({
        inputRange: [0, 1400, 1500],
        outputRange: [0.99, 0.99, 0],
    });
    const opacity2 = translateY2.current.interpolate({
        inputRange: [0, 1900, 2000],
        outputRange: [0.99, 0.99, 0],
    });
    const isDarkMode = useColorScheme() === "dark";
    const emoji = useRef(
        gameState === GameState.GaveUp
            ? "🙃"
            : Math.round(Math.random()) === 0
            ? "😢"
            : "😭",
    ).current;

    const onPressNewGame = useCallback(() => {
        newGame().then(() => navigation.goBack());
    }, [navigation, newGame]);

    useEffect(() => {
        logEvent(gameState === GameState.GaveUp ? "gave_up" : "lost", {
            targetWord,
            wordLength,
            difficulty,
            guesses: `${currentGuess + 1} / ${WORD_GUESS_COUNT}`,
        });
        Animated.stagger(100, [
            Animated.timing(translateY1.current, {
                toValue: 1500,
                delay: 200,
                duration: 3000,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
            }),
            Animated.timing(translateY2.current, {
                toValue: 2000,
                delay: 200,
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
            {skullsArray.map((_, index) => (
                <Animated.View
                    key={index}
                    style={{
                        position: "absolute",
                        top: "-10%",
                        left: (Dimensions.get("window").width / 50) * index,
                        marginLeft: -15,
                        transform: [
                            {
                                scale: Math.random() * (1 - 0.5 + 1) + 0.5,
                            },
                            {
                                translateY:
                                    index % 2
                                        ? translateY2.current
                                        : translateY1.current,
                            },
                        ],
                        opacity: index % 2 ? opacity2 : opacity1,
                    }}
                >
                    <Text
                        style={{
                            color: "#FFF",
                            fontSize: 30,
                        }}
                    >
                        💩
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
                        {emoji}
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
                        {gameState === GameState.GaveUp
                            ? DICTIONARY().game.lost.tryAgain
                            : DICTIONARY().game.lost.sorry}
                    </Paragraph>

                    <View style={{ marginVertical: 10 }}>
                        <Paragraph align="center" size={20}>
                            {DICTIONARY().game.lost.theWordWas}
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

                    {gameState !== GameState.GaveUp && <ScoreCalculation />}

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
