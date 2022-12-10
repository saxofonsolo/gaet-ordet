import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Header } from "../../components/Header/Header.component";
import { Paragraph } from "../../components/elements/Paragraph.component";
import { NewGame } from "../../components/NewGame/NewGame.component";
import { useTheme } from "../../hooks/theme.hook";

interface ItemProps {
    text: string;
    value?: string;
    onPress: () => void;
}

const Item = ({ text, value, onPress }: ItemProps) => {
    return (
        <View
            style={{
                borderTopWidth: 1,
                borderTopColor: "#7f7f7f7f",
            }}
        >
            <Pressable
                onPress={onPress}
                style={{
                    paddingVertical: 20,
                    paddingHorizontal: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Paragraph black size={16}>
                    {text}
                </Paragraph>
                <Paragraph size={16}>{value}</Paragraph>
            </Pressable>
        </View>
    );
};

export const HomeMenuScreen: React.FC = () => {
    const [showNewGame, setShowNewGame] = useState(false);
    const { colors, colorScheme, setColorScheme } = useTheme();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
            }}
        >
            <Header />
            <View
                style={{
                    borderBottomWidth: 1,
                    borderBottomColor: "#7f7f7f7f",
                }}
            >
                <Item
                    text="START NYT SPIL"
                    value={showNewGame ? "" : "▶"}
                    onPress={() => setShowNewGame((state) => !state)}
                />
                {showNewGame && <NewGame />}
                <Item
                    text="FARVESKEMA"
                    value={
                        colorScheme === "dark"
                            ? "MØRKT"
                            : colorScheme === "light"
                            ? "LYST"
                            : "AUTO"
                    }
                    onPress={() =>
                        setColorScheme((state) =>
                            state === "auto"
                                ? "dark"
                                : state === "dark"
                                ? "light"
                                : "auto",
                        )
                    }
                />
                <Item
                    text="BRUGER"
                    value="OPRET / LOG IND"
                    onPress={() => setShowNewGame((state) => !state)}
                />
            </View>
        </View>
    );
};
