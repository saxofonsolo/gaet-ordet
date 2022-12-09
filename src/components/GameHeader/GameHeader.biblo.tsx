import { BibloBio, BibloItem } from "@biblo/react-native";
import React from "react";
import { GameHeader } from "./GameHeader.component";

type Props = React.ComponentProps<typeof GameHeader>;

export default {
    title: "GameHeader",
    tags: ["header"],
    props: {
        score: 0,
        totalScore: 0,
        currentGuess: 0,
        onGiveUp: () => null,
    },
    wrapperStyle: {
        marginHorizontal: 0,
    },
} as BibloBio<Props>;

const Template: BibloItem<Props> = (props) => <GameHeader {...props} />;

export const Default = Template.bind({});

export const WithTotalScore = Template.bind({});
WithTotalScore.props = {
    totalScore: 19876,
};

export const WithNewScore = Template.bind({});
WithNewScore.props = {
    totalScore: 19876,
    score: 1234,
    currentGuess: 1,
};

export const AtGuessNumber3 = Template.bind({});
AtGuessNumber3.description = "Ved tredje gæt vises muligheden for at opgive.";
AtGuessNumber3.props = {
    totalScore: 19876,
    score: 1234,
    currentGuess: 2,
};
