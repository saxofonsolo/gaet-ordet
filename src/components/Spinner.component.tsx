import React, { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";

interface SpinnerProps {
    color?: string;
    absoluteCentered?: boolean;
}

export const Spinner = React.memo(
    ({ color = "black", absoluteCentered }: SpinnerProps) => {
        const animation = useRef(new Animated.Value(0)).current;
        const rotateInterpolate = animation.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", "360deg"],
        });

        useEffect(() => {
            Animated.loop(
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ).start();
        }, [animation]);

        return (
            <Animated.View
                style={{
                    width: 24,
                    height: 24,
                    transform: [{ rotate: rotateInterpolate }],
                    position: absoluteCentered ? "absolute" : "relative",
                    top: absoluteCentered ? "50%" : undefined,
                    marginTop: absoluteCentered ? -12 : undefined,
                }}
            >
                <View
                    style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderTopColor: color,
                        borderRightColor: "white",
                    }}
                />
            </Animated.View>
        );
    },
);

Spinner.displayName = "Spinner";
