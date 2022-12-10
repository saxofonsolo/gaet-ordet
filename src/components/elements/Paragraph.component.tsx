import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";
import { FONTS } from "../../constants/fonts.constants";
import { useTheme } from "../../hooks/theme.hook";

interface ParagraphProps {
    bold?: boolean;
    black?: boolean;
    light?: boolean;
    size?: number;
    uppercase?: boolean;
    letterSpacing?: number;
    align?: "center" | "right" | "left";
    style?: StyleProp<TextStyle>;
    children: React.ReactNode;
}

export const Paragraph = ({
    bold,
    black,
    light,
    size,
    uppercase,
    letterSpacing,
    align,
    style,
    children,
}: ParagraphProps): JSX.Element => {
    const { colors } = useTheme();
    return (
        <Text
            style={[
                {
                    fontFamily: black
                        ? FONTS.BLACK
                        : bold
                        ? FONTS.BOLD
                        : light
                        ? FONTS.LIGHT
                        : FONTS.REGULAR,
                    fontSize: size || 16,
                    textAlign: align || "left",
                    textTransform: uppercase ? "uppercase" : "none",
                    color: colors.text,
                    letterSpacing,
                },
                style,
            ]}
        >
            {children}
        </Text>
    );
};
