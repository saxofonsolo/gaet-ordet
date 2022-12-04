import React from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "../../constants/colors.constants";
import DannebrogSvg from "../../graphics/dannebrog.svg";
import BurgerSvg from "../../graphics/burger.svg";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";
import { GameHeader } from "../../components/header/GameHeader.component";
import { Paragraph } from "../../components/elements/Paragraph.component";
import { GameMainScreen } from "./game/GameMain.screen";

export const HomeMainScreen = (): JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const isDarkMode = useColorScheme() === "dark";

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: isDarkMode ? COLORS.BLACK : COLORS.WHITE,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View style={{ flexDirection: "row", width: 60 }} />
                <View
                    style={{
                        height: 60,
                        justifyContent: "center",
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Paragraph black size={20}>
                        GÆT
                    </Paragraph>
                    <DannebrogSvg height="40" width="60" />
                    <Paragraph black size={20}>
                        ORDET
                    </Paragraph>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() =>
                            navigation.navigate({
                                name: SCREEN_NAMES.HOME.MODAL_MENU,
                                params: {},
                            })
                        }
                        style={{ padding: 15 }}
                    >
                        <BurgerSvg width={30} height={30} />
                    </Pressable>
                </View>
            </View>
            <GameHeader />
            <View style={{ flex: 1 }}>
                <GameMainScreen />
            </View>
        </View>
    );
};
