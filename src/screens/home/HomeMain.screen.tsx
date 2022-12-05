import React, { useCallback } from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "../../constants/colors.constants";
import DannebrogSvg from "../../graphics/dannebrog.svg";
import BurgerSvg from "../../graphics/burger.svg";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";
import { GameHeader } from "../../components/header/GameHeader.component";
import { Paragraph } from "../../components/elements/Paragraph.component";
import { useScore } from "../../hooks/score.hook";
import { useGame } from "../../hooks/game.hook";
import { GameMainScreen } from "./game/GameMain.screen";

export const HomeMainScreen: React.FC = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const isDarkMode = useColorScheme() === "dark";
    const { totalScore, score } = useScore();
    const { currentGuess } = useGame();

    const showGiveUpModal = useCallback(
        () =>
            navigation.navigate({
                name: SCREEN_NAMES.home.modalGiveUp,
                params: {},
            }),
        [navigation],
    );

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
                    <Pressable
                        accessibilityRole="button"
                        onPress={() =>
                            navigation.navigate({
                                name: SCREEN_NAMES.componentLibrary.root,
                                params: {},
                            })
                        }
                    >
                        <DannebrogSvg height="40" width="60" />
                    </Pressable>
                    <Paragraph black size={20}>
                        ORDET
                    </Paragraph>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Pressable
                        accessibilityRole="button"
                        onPress={() =>
                            navigation.navigate({
                                name: SCREEN_NAMES.home.modalMenu,
                                params: {},
                            })
                        }
                        style={{ padding: 15 }}
                    >
                        <BurgerSvg width={30} height={30} />
                    </Pressable>
                </View>
            </View>
            <GameHeader
                totalScore={totalScore}
                score={score}
                currentGuess={currentGuess}
                onGiveUp={showGiveUpModal}
            />
            <View style={{ flex: 1 }}>
                <GameMainScreen />
            </View>
        </View>
    );
};
