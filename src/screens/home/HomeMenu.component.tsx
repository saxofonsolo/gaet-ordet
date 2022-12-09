import React from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Header } from "../../components/Header/Header.component";
import { Paragraph } from "../../components/elements/Paragraph.component";
import { COLORS } from "../../constants/colors.constants";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";

interface ItemProps {
    text: string;
    value?: string;
    onPress: () => void;
}

const Item = ({ text, value, onPress }: ItemProps) => {
    return (
        <View
            style={{
                borderBottomWidth: 1,
                borderBottomColor: "#7f7f7f7f",
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
    const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
    const isDarkMode = useColorScheme() === "dark";

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: isDarkMode ? COLORS.BLACK : COLORS.WHITE,
            }}
        >
            <Header />
            <View
                style={{
                    borderTopWidth: 1,
                    borderTopColor: "#7f7f7f7f",
                }}
            >
                <Item
                    text="START NYT SPIL"
                    value={"▶"}
                    onPress={() =>
                        navigate({
                            name: SCREEN_NAMES.home.modalNewGame,
                            params: {},
                        })
                    }
                />
                <Item
                    text="FARVESKEMA"
                    value={isDarkMode ? "MØRKT" : "LYST"}
                    onPress={() =>
                        navigate({
                            name: SCREEN_NAMES.home.modalNewGame,
                            params: {},
                        })
                    }
                />
                <Item
                    text="BRUGER"
                    value="OPRET / LOG IND"
                    onPress={() =>
                        navigate({
                            name: SCREEN_NAMES.home.modalNewGame,
                            params: {},
                        })
                    }
                />
            </View>
        </View>
    );
};
