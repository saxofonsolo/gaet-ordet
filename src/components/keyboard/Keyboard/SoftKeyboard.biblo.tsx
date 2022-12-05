import { BibloBio, BibloItem } from "@biblo/react-native";
import React from "react";
import { SoftKeyboard } from "./SoftKeyboard.component";

type Props = React.ComponentProps<typeof SoftKeyboard>;

export default {
    title: "SoftKeyboard",
    tags: ["interactive", "button"],
    props: {
        value: "A",
        onPress: () => null,
    },
    wrapperStyle: {
        marginHorizontal: 0,
    },
} as BibloBio<Props>;

const Template: BibloItem<Props> = (props) => <SoftKeyboard {...props} />;

export const Default = Template.bind({});
