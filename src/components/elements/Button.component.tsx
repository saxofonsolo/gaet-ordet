import React, { useCallback, useRef } from "react";
import {
    Animated,
    Pressable,
    StyleProp,
    Text,
    useColorScheme,
    View,
    ViewStyle,
} from "react-native";
import { FONTS } from "../../constants/fonts.constants";
import { COLORS } from "../../constants/colors.constants";

export enum ButtonType {
    Normal,
    Warning,
    Alert,
}

interface ButtonProps {
    text: string;
    onPress: () => void;
    type?: ButtonType;
    style?: StyleProp<ViewStyle>;
}

export const Button = ({
    text,
    onPress,
    type = ButtonType.Normal,
    style,
}: ButtonProps): JSX.Element => {
    const isDarkMode = useColorScheme() === "dark";
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = useCallback(() => {
        scale.setValue(0.9);
    }, [scale]);

    const handlePressOut = useCallback(() => {
        Animated.timing(scale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }, [scale]);

    return (
        <View style={[{ overflow: "hidden", borderRadius: 5 }, style]}>
            <Pressable
                accessibilityRole="button"
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={{
                    backgroundColor:
                        type === ButtonType.Warning
                            ? isDarkMode
                                ? COLORS.ORANGE_DARKER
                                : COLORS.ORANGE_DARK
                            : type === ButtonType.Alert
                            ? isDarkMode
                                ? COLORS.PINK_DARKER
                                : COLORS.PINK_DARK
                            : isDarkMode
                            ? COLORS.CYAN_DARKER
                            : COLORS.CYAN_DARK,
                }}
            >
                <Animated.View
                    style={{
                        padding: 10,
                        borderRadius: 5,
                        backgroundColor:
                            type === ButtonType.Warning
                                ? isDarkMode
                                    ? COLORS.ORANGE_DARK
                                    : COLORS.ORANGE
                                : type === ButtonType.Alert
                                ? isDarkMode
                                    ? COLORS.PINK_DARK
                                    : COLORS.PINK
                                : isDarkMode
                                ? COLORS.CYAN_DARK
                                : COLORS.CYAN,
                        transform: [
                            { perspective: 100 },
                            {
                                scale,
                            },
                        ],
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontFamily: FONTS.BOLD,
                            color: COLORS.WHITE,
                            textShadowColor:
                                type === ButtonType.Warning
                                    ? isDarkMode
                                        ? COLORS.ORANGE_DARKER
                                        : COLORS.ORANGE_DARK
                                    : type === ButtonType.Alert
                                    ? isDarkMode
                                        ? COLORS.PINK_DARKER
                                        : COLORS.PINK_DARK
                                    : isDarkMode
                                    ? COLORS.CYAN_DARKER
                                    : COLORS.CYAN_DARK,
                            textShadowRadius: 1,
                            textShadowOffset: { width: -1, height: 1 },
                            textAlign: "center",
                        }}
                    >
                        {text}
                    </Text>
                </Animated.View>
            </Pressable>
        </View>
    );
};
