import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, useColorScheme } from "react-native";
import { COLORS } from "../../constants/colors.constants";
import { FONTS } from "../../constants/fonts.constants";

interface GuessLetterProps {
    letter: string;
    letterIndex: number;
    size: number;
    isCurrent?: boolean;
    isClose?: boolean;
    isCorrect?: boolean;
    isRedundant?: boolean;
    isInEditMode?: boolean;
    onPress?: () => void;
    previouslyGuessed?: boolean;
}

export const GuessLetter = React.memo(
    ({
        letter,
        letterIndex,
        size,
        isCurrent,
        isClose,
        isCorrect,
        isRedundant,
        isInEditMode,
        onPress,
        previouslyGuessed,
    }: GuessLetterProps): JSX.Element => {
        const [backgroundColor, setBackgroundColor] = useState("#0000");
        const [borderColor, setBorderColor] = useState("#0000");
        const [textColor, setTextColor] = useState("#0000");
        const isDarkMode = useColorScheme() === "dark";
        const scaleX = useRef(new Animated.Value(1)).current;
        const scaleY = useRef(new Animated.Value(1)).current;

        const setNewColors = useCallback(() => {
            setBackgroundColor(
                isDarkMode
                    ? isCorrect
                        ? COLORS.CYAN_DARKER
                        : isClose
                        ? COLORS.ORANGE_DARKER
                        : isRedundant
                        ? "#222"
                        : "#070707"
                    : isCorrect
                    ? COLORS.CYAN
                    : isClose
                    ? COLORS.ORANGE
                    : isRedundant
                    ? "#DDD"
                    : COLORS.WHITE,
            );

            setBorderColor(
                isDarkMode
                    ? isCorrect || (previouslyGuessed && isCurrent)
                        ? COLORS.CYAN
                        : isClose
                        ? COLORS.ORANGE
                        : isRedundant
                        ? "#2220"
                        : isCurrent
                        ? "#777"
                        : "#333"
                    : isCorrect || (previouslyGuessed && isCurrent)
                    ? COLORS.CYAN_DARK
                    : isClose
                    ? COLORS.ORANGE_DARK
                    : isRedundant
                    ? "#DDD0"
                    : isCurrent
                    ? "#888"
                    : "#CCC",
            );

            setTextColor(
                isInEditMode ? "#7f7f7f" : isDarkMode ? "#EEE" : "#111",
            );
        }, [
            isClose,
            isCorrect,
            isRedundant,
            previouslyGuessed,
            isCurrent,
            isDarkMode,
            isInEditMode,
        ]);

        useEffect(() => {
            if (isClose || isCorrect || isRedundant) {
                Animated.timing(scaleY, {
                    toValue: 0,
                    duration: 75,
                    delay: 200 * letterIndex,
                    useNativeDriver: true,
                }).start(() => {
                    setNewColors();
                    Animated.timing(scaleY, {
                        toValue: 1,
                        duration: 125,
                        useNativeDriver: true,
                    }).start();
                });
            } else {
                setNewColors();
            }
        }, [
            isClose,
            isCorrect,
            isRedundant,
            isDarkMode,
            setNewColors,
            letterIndex,
            scaleY,
        ]);

        useEffect(() => {
            if (isCurrent) {
                setBorderColor(
                    isDarkMode
                        ? isInEditMode
                            ? COLORS.PINK
                            : "#777"
                        : isInEditMode
                        ? COLORS.PINK_DARK
                        : "#888",
                );
            }
        }, [isCurrent, isInEditMode, isDarkMode]);

        useEffect(() => {
            if (letter) {
                scaleX.setValue(1.125);
                scaleY.setValue(1.125);
                Animated.parallel([
                    Animated.timing(scaleX, {
                        toValue: 1,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleY, {
                        toValue: 1,
                        duration: 250,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        }, [letter, scaleX, scaleY]);

        return (
            <Animated.View
                style={{
                    width: size,
                    height: size,
                    padding: 3,
                    transform: [{ scaleX }, { scaleY }],
                }}
            >
                <Pressable
                    disabled={!letter}
                    onPress={onPress}
                    style={{
                        height: "100%",
                        justifyContent: "center",
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor,
                        backgroundColor,
                    }}
                >
                    <Text
                        style={{
                            fontFamily: FONTS.BOLD,
                            fontSize: size * 0.5,
                            lineHeight: size * 0.675,
                            textAlign: "center",
                            color: textColor,
                        }}
                    >
                        {letter}
                    </Text>
                </Pressable>
            </Animated.View>
        );
    },
);

GuessLetter.displayName = "GuessLetter";
