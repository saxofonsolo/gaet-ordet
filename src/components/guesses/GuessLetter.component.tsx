import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text } from "react-native";
import { FONTS } from "../../constants/fonts.constants";
import { useTheme } from "../../hooks/theme.hook";

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
        const { colors } = useTheme();
        const scaleX = useRef(new Animated.Value(1)).current;
        const scaleY = useRef(new Animated.Value(1)).current;

        const setNewColors = useCallback(() => {
            setBackgroundColor(
                isCorrect
                    ? colors.letter.background.correct
                    : isClose
                    ? colors.letter.background.close
                    : isRedundant
                    ? colors.letter.background.redundant
                    : colors.letter.background.default,
            );

            setBorderColor(
                isCorrect || (previouslyGuessed && isCurrent)
                    ? colors.letter.border.correct
                    : isClose
                    ? colors.letter.border.close
                    : isRedundant
                    ? colors.letter.border.redundant
                    : isCurrent
                    ? colors.letter.border.current
                    : colors.letter.border.default,
            );

            setTextColor(
                isInEditMode
                    ? colors.letter.text.editMode
                    : colors.letter.text.default,
            );
        }, [
            isClose,
            isCorrect,
            isRedundant,
            previouslyGuessed,
            isCurrent,
            isInEditMode,
            colors,
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
            colors,
            setNewColors,
            letterIndex,
            scaleY,
        ]);

        useEffect(() => {
            if (isCurrent) {
                setBorderColor(
                    isInEditMode
                        ? colors.letter.border.editMode
                        : colors.letter.border.current,
                );
            }
        }, [isCurrent, isInEditMode, colors]);

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
