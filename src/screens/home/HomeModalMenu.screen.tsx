import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, useColorScheme, View } from "react-native";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
    Difficulty,
    GameOptions,
    useGame,
    WordLength,
} from "../../hooks/game.hook";
import { Button } from "../../components/elements/Button.component";
import { COLORS } from "../../constants/colors.constants";
import { DICTIONARY } from "../../constants/dictionary.constants";
import { Paragraph } from "../../components/elements/Paragraph.component";

export const HomeModalMenuScreen = (): JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { difficulty, wordLength, newGame } = useGame();
    const [newDifficulty, setNewDifficulty] = useState<Difficulty>(difficulty);
    const [newWordLength, setNewWordLength] = useState<WordLength>(wordLength);
    const isDarkMode = useColorScheme() === "dark";
    const emojiScale = useRef(new Animated.Value(1));
    const firstRender = useRef(true);

    const startNewGame = useCallback(
        (options: GameOptions) => {
            newGame(options).then(() => navigation.goBack());
        },
        [navigation, newGame],
    );

    useEffect(() => {
        if (!firstRender.current) {
            emojiScale.current.setValue(1.15);
            Animated.spring(emojiScale.current, {
                toValue: 1,
                friction: 5,
                tension: 100,
                useNativeDriver: true,
            }).start();
        } else {
            firstRender.current = false;
        }
    }, [newDifficulty, newWordLength]);

    return (
        <View
            style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Pressable
                onPress={() => navigation.goBack()}
                accessibilityRole="button"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                }}
            />

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
                        alignItems: "center",
                        transform: [{ translateX: -50 }, { translateY: -50 }],
                    }}
                >
                    <Animated.View
                        style={{
                            transform: [
                                { scale: emojiScale.current },
                                {
                                    rotateZ: emojiScale.current.interpolate({
                                        inputRange: [1, 5],
                                        outputRange: ["0deg", "-360deg"],
                                    }),
                                },
                            ],
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
                            {newDifficulty + newWordLength ===
                            Difficulty.Expert + WordLength.Seven // === 9
                                ? "🤮"
                                : newDifficulty + newWordLength ===
                                  Difficulty.Hard + WordLength.Seven // === 8
                                ? "🤯"
                                : newDifficulty + newWordLength ===
                                  Difficulty.Normal + WordLength.Seven // === 7
                                ? "😬"
                                : newDifficulty + newWordLength ===
                                  Difficulty.Hard + WordLength.Five // === 6
                                ? "😮"
                                : "🙂"}
                        </Text>
                    </Animated.View>
                </View>

                <View
                    style={{
                        paddingTop: 50,
                        paddingBottom: 20,
                        paddingHorizontal: 20,
                    }}
                >
                    <Paragraph black align="center" size={30}>
                        {DICTIONARY().game.new}
                    </Paragraph>

                    <View style={{ marginBottom: 20 }}>
                        <Slider
                            style={{
                                marginHorizontal: 15,
                                paddingVertical: 25,
                            }}
                            minimumValue={WordLength.Five}
                            maximumValue={WordLength.Seven}
                            step={1}
                            value={newWordLength}
                            thumbTintColor={
                                newWordLength === WordLength.Five
                                    ? COLORS.CYAN
                                    : newWordLength === WordLength.Six
                                    ? COLORS.ORANGE
                                    : COLORS.PINK
                            }
                            minimumTrackTintColor={
                                newWordLength === WordLength.Five
                                    ? COLORS.CYAN
                                    : newWordLength === WordLength.Six
                                    ? COLORS.ORANGE
                                    : COLORS.PINK
                            }
                            maximumTrackTintColor={
                                isDarkMode ? COLORS.WHITE : "#777"
                            }
                            tapToSeek
                            onValueChange={(value) => setNewWordLength(value)}
                            onSlidingComplete={(value) =>
                                setNewWordLength(value)
                            }
                        />

                        <View
                            style={{ flexDirection: "row" }}
                            pointerEvents="none"
                        >
                            <View
                                style={{
                                    marginTop: -15,
                                    width: "33.333%",
                                }}
                            >
                                <Paragraph bold size={14}>
                                    {"  "}
                                    {
                                        DICTIONARY({ n: WordLength.Five })
                                            .difficulties.nCharacters
                                    }
                                </Paragraph>
                            </View>

                            <View
                                style={{
                                    marginTop: -15,
                                    width: "33.333%",
                                    alignItems: "center",
                                }}
                            >
                                <Paragraph bold size={14}>
                                    {
                                        DICTIONARY({ n: WordLength.Six })
                                            .difficulties.nCharacters
                                    }
                                </Paragraph>
                            </View>

                            <View
                                style={{
                                    marginTop: -15,
                                    width: "33.333%",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Paragraph bold size={14}>
                                    {
                                        DICTIONARY({ n: WordLength.Seven })
                                            .difficulties.nCharacters
                                    }
                                    {"  "}
                                </Paragraph>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginBottom: 20 }}>
                        <Slider
                            style={{
                                marginHorizontal: 15,
                                paddingVertical: 25,
                            }}
                            minimumValue={Difficulty.Normal}
                            maximumValue={Difficulty.Expert}
                            step={1}
                            value={newDifficulty}
                            thumbTintColor={
                                newDifficulty === Difficulty.Normal
                                    ? COLORS.CYAN
                                    : newDifficulty === Difficulty.Hard
                                    ? COLORS.ORANGE
                                    : COLORS.PINK
                            }
                            minimumTrackTintColor={
                                newDifficulty === Difficulty.Normal
                                    ? COLORS.CYAN
                                    : newDifficulty === Difficulty.Hard
                                    ? COLORS.ORANGE
                                    : COLORS.PINK
                            }
                            maximumTrackTintColor={
                                isDarkMode ? COLORS.WHITE : "#777"
                            }
                            tapToSeek={true}
                            onValueChange={(value) => setNewDifficulty(value)}
                            onSlidingComplete={(value) =>
                                setNewDifficulty(value)
                            }
                        />

                        <View
                            style={{ flexDirection: "row", marginBottom: 10 }}
                            pointerEvents="none"
                        >
                            <View
                                style={{
                                    marginTop: -15,
                                    width: "33.333%",
                                }}
                            >
                                <Paragraph bold size={14}>
                                    {DICTIONARY().difficulties.normal}
                                </Paragraph>
                            </View>

                            <View
                                style={{
                                    marginTop: -15,
                                    width: "33.333%",
                                    alignItems: "center",
                                }}
                            >
                                <Paragraph bold size={14}>
                                    {DICTIONARY().difficulties.hard}
                                </Paragraph>
                            </View>

                            <View
                                style={{
                                    marginTop: -15,
                                    width: "33.333%",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Paragraph bold size={14}>
                                    {DICTIONARY().difficulties.expert}
                                </Paragraph>
                            </View>
                        </View>
                    </View>

                    <Button
                        text={DICTIONARY().game.start}
                        onPress={() =>
                            startNewGame({
                                difficulty: newDifficulty,
                                wordLength: newWordLength,
                            })
                        }
                    />
                </View>
            </View>
        </View>
    );
};
