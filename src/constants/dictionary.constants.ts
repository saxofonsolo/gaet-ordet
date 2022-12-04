// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const DICTIONARY = (
    replace: { [key: string]: string | number } = {},
) => {
    const replaceRegex = new RegExp(
        "{{" + Object.keys(replace).join("}}|{{") + "}}",
        "g",
    );
    const doReplace = (text: string): string =>
        text.replace(
            replaceRegex,
            (match) => String(replace[match.slice(2, -2)]) || "",
        );

    return {
        common: {
            yes: "JA",
            no: "NEJ",
            continue: "FORTSÆT",
        },
        game: {
            won: {
                phew: "PYH!",
                alright: "SÅDAN",
                wow: "WAUW!",
                congratulations: "TILLYKKE",
                youGuessed: "DU GÆTTEDE",
            },
            lost: {
                sorry: "DESVÆRRE",
                tryAgain: "PRØV IGEN",
                theWordWas: "ORDET VAR",
            },
            new: "NYT SPIL",
            start: "START SPIL",
            giveUp: {
                title: "OPGIV",
                text: "ER DU SIKKER PÅ,\nAT DU VIL GIVE OP?",
            },
        },
        score: {
            yourGuesses: "Dine gæt",
            timeBonus: "Tidsbonus",
            spotsLeft: doReplace("{{n}} felter tilbage"),
            winsInARow: doReplace("{{n}} sejre i træk"),
            subtotal: "Subtotal",
            total: "Total",
        },
        difficulties: {
            nCharacters: doReplace("{{n}} TEGN"),
            normal: "NORMAL",
            hard: "SVÆRT",
            expert: "EKSPERT",
        },
        warnings: {
            nthLetter: doReplace("{{nth}}. bogstav skal være {{letter}}"),
            missingLetter: doReplace("Ordet mangler et {{letter}}"),
            tooShort: "Ordet er for kort",
            notFound: "Ordet findes ikke i ordlisten",
        },
    };
};
