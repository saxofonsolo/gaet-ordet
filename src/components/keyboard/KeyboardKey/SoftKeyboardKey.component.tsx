import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Pressable,
    Text,
    useColorScheme,
    View,
} from "react-native";
import { COLORS } from "../../../constants/colors.constants";
import { FONTS } from "../../../constants/fonts.constants";

interface SoftKeyboardKeyProps {
    value: string;
    onPress: (value: string) => void;
    disabled?: boolean;
    forbidden?: boolean;
    isClose?: boolean;
    isCorrect?: boolean;
    isRedundant?: boolean;
}

export const SoftKeyboardKey = React.memo(
    ({
        value,
        onPress,
        disabled,
        forbidden,
        isClose,
        isCorrect,
        isRedundant,
    }: SoftKeyboardKeyProps): JSX.Element => {
        const [backgroundColor, setBackgroundColor] = useState("#0000");
        const [borderColor, setBorderColor] = useState("#0000");
        const [textColor, setTextColor] = useState("#0000");
        const isDarkMode = useColorScheme() === "dark";
        const keyWidth = Math.min(
            65,
            (Dimensions.get("window").width - 4) / 11,
        );
        const rotateX = useRef(new Animated.Value(0));
        const scaleX = useRef(new Animated.Value(1));
        const scaleY = useRef(new Animated.Value(1));

        const handlePressIn = useCallback(() => {
            rotateX.current.setValue(20);
            scaleX.current.setValue(0.9);
            scaleY.current.setValue(0.9);
        }, []);

        const handlePressOut = useCallback(() => {
            Animated.parallel([
                Animated.timing(rotateX.current, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleX.current, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleY.current, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        }, []);

        const setNewColors = useCallback(() => {
            setBackgroundColor(
                isDarkMode
                    ? isCorrect
                        ? COLORS.CYAN_DARKER
                        : isClose
                        ? COLORS.ORANGE_DARKER
                        : isRedundant
                        ? COLORS.BLACK
                        : "#222"
                    : isCorrect
                    ? COLORS.CYAN
                    : isClose
                    ? COLORS.ORANGE
                    : isRedundant
                    ? COLORS.WHITE
                    : "#DDD",
            );

            setBorderColor(
                isDarkMode
                    ? isCorrect
                        ? COLORS.CYAN
                        : isClose
                        ? COLORS.ORANGE
                        : isRedundant && !forbidden
                        ? "#222"
                        : "#333"
                    : isCorrect
                    ? COLORS.CYAN_DARK
                    : isClose
                    ? COLORS.ORANGE_DARK
                    : isRedundant && !forbidden
                    ? "#DDD"
                    : "#CCC",
            );

            setTextColor(
                isDarkMode
                    ? isRedundant && !forbidden
                        ? "#555"
                        : "#DDD"
                    : isRedundant && !forbidden
                    ? "#0008"
                    : "#222",
            );
        }, [isClose, isCorrect, isRedundant, isDarkMode, forbidden]);

        useEffect(() => {
            if (isClose || isCorrect || isRedundant) {
                Animated.timing(scaleX.current, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }).start(() => {
                    setNewColors();
                    Animated.timing(scaleX.current, {
                        toValue: 1,
                        duration: 100,
                        useNativeDriver: true,
                    }).start();
                });
            } else {
                setNewColors();
            }
        }, [isClose, isCorrect, isRedundant, isDarkMode, setNewColors]);

        return (
            <View
                style={{
                    width: keyWidth * value.length,
                }}
            >
                <View
                    style={{
                        borderRadius: 5,
                        overflow: "hidden",
                    }}
                >
                    <Pressable
                        accessibilityRole="button"
                        onPress={() => onPress(value)}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        disabled={disabled || forbidden}
                        style={{ padding: 2, opacity: forbidden ? 0.5 : 1 }}
                    >
                        <Animated.View
                            style={[
                                {
                                    height: 65,
                                    justifyContent: "center",
                                    borderRadius: 5,
                                    borderWidth: 1,
                                    borderBottomWidth: 3,
                                    borderColor,
                                    backgroundColor: forbidden
                                        ? "transparent"
                                        : backgroundColor,
                                },
                                {
                                    transform: [
                                        { perspective: 100 },
                                        {
                                            rotateX:
                                                rotateX.current.interpolate({
                                                    inputRange: [0, 360],
                                                    outputRange: [
                                                        "0deg",
                                                        "360deg",
                                                    ],
                                                }),
                                        },
                                        { scaleX: scaleX.current },
                                        { scaleY: scaleY.current },
                                    ],
                                },
                            ]}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontFamily: FONTS.REGULAR,
                                    fontSize: 14 + 6 * value.length,
                                    color: textColor,
                                }}
                            >
                                {value.replace("OK", "✔").replace("BS", "⌫")}
                            </Text>
                        </Animated.View>
                    </Pressable>
                </View>
            </View>
        );
    },
);

SoftKeyboardKey.displayName = "SoftKeyboardKey";
