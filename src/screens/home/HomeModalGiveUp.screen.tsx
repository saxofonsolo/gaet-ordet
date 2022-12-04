import React, { useCallback } from "react";
import { Pressable, Text, useColorScheme, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useGame } from "../../hooks/game.hook";
import { Button, ButtonType } from "../../components/elements/Button.component";
import { COLORS } from "../../constants/colors.constants";
import { DICTIONARY } from "../../constants/dictionary.constants";
import { SCREEN_NAMES } from "../../constants/screenNames.constants";
import { Paragraph } from "../../components/elements/Paragraph.component";

export const HomeModalGiveUpScreen = (): JSX.Element => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const { giveUp } = useGame();
    const isDarkMode = useColorScheme() === "dark";

    const onPressNo = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const onPressYes = useCallback(() => {
        giveUp().then(() => navigation.replace(SCREEN_NAMES.HOME.MODAL_LOSER));
    }, [navigation, giveUp]);

    return (
        <View
            style={{
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Pressable
                onPress={onPressNo}
                accessibilityRole="button"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                }}
            />

            <View
                style={{
                    position: "relative",
                    backgroundColor: isDarkMode ? "#222" : COLORS.WHITE,
                    width: 320,
                    borderRadius: 5,
                }}
            >
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: "50%",
                        backgroundColor: isDarkMode ? "#222" : COLORS.WHITE,
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        justifyContent: "center",
                        transform: [{ translateX: -50 }, { translateY: -50 }],
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 60,
                            lineHeight: 75,
                            textAlign: "center",
                        }}
                    >
                        🤔
                    </Text>
                </View>
                <View
                    style={{
                        paddingTop: 50,
                        paddingBottom: 20,
                        paddingHorizontal: 20,
                    }}
                >
                    <Paragraph black align="center" size={30}>
                        {DICTIONARY().game.giveUp.title}
                    </Paragraph>
                    <View style={{ marginVertical: 10 }}>
                        <Paragraph align="center" size={20}>
                            {DICTIONARY().game.giveUp.text}
                        </Paragraph>
                    </View>
                    <View
                        style={{ flexDirection: "row", marginHorizontal: -5 }}
                    >
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <Button
                                text={DICTIONARY().common.no}
                                onPress={onPressNo}
                                style={{ marginTop: 10 }}
                            />
                        </View>
                        <View style={{ flex: 1, marginHorizontal: 5 }}>
                            <Button
                                text={DICTIONARY().common.yes}
                                onPress={onPressYes}
                                type={ButtonType.Alert}
                                style={{ marginTop: 10 }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
