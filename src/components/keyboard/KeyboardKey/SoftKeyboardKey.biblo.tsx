import React from "react";
import { BibloBio, BibloItem } from "@biblo/react-native";
import { View } from "react-native";
import { SoftKeyboardKey } from "./SoftKeyboardKey.component";

type Props = React.ComponentProps<typeof SoftKeyboardKey>;

export default {
    title: "SoftKeyboardKey",
    tags: ["interactive", "button"],
    props: {
        value: "A",
        onPress: () => null,
    },
} as BibloBio<Props>;

const Template: BibloItem<Props> = (props) => <SoftKeyboardKey {...props} />;

export const Default = Template.bind({});

export const Backspace = Template.bind({});
Backspace.description = "Bruges til at slette et bogstav.";
Backspace.props = {
    value: "BS",
};

export const Okay = Template.bind({});
Okay.description = "Bruges til at sende et gæt.";
Okay.props = {
    value: "OK",
};

export const Disabled = Template.bind({});
Disabled.description = "Deaktiveret tast.";
Disabled.props = {
    disabled: true,
};

export const Correct = Template.bind({});
Correct.description =
    "Vises når et bogstav tidligere er gættet rigtigt på dets korrekte placering i ordet.";
Correct.props = {
    value: "B",
    isCorrect: true,
};

export const Close = Template.bind({});
Close.description =
    "Vises når et bogstav tidligere er gættet rigtigt på en forkert placering i ordet.";
Close.props = {
    value: "C",
    isClose: true,
};

export const Redundant = Template.bind({});
Redundant.description =
    "Vises når et bogstav tidligere er gættet, men ikke findes i ordet.";
Redundant.props = {
    value: "D",
    isRedundant: true,
};

export const Forbidden: BibloItem<Props> = (props) => (
    <View style={{ flexDirection: "row" }}>
        <SoftKeyboardKey {...props} value="A" forbidden />
        <SoftKeyboardKey {...props} value="B" forbidden isCorrect />
        <SoftKeyboardKey {...props} value="C" forbidden isClose />
        <SoftKeyboardKey {...props} value="D" forbidden isRedundant />
    </View>
);
Forbidden.description =
    "Vises når et bogstav tidligere er gættet rigtigt eller forkert, og derfor ikke kan vælges.";
