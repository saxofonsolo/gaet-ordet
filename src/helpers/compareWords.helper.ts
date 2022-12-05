import { KeyState } from "../interfaces/LetterState.interface";

export const compareWords = (subject: string, target: string): KeyState[] => {
    const subjectLetters = subject.split("");
    const targetLetters = target.split("");
    const targetLettersClone = [...targetLetters];
    const returnArray: KeyState[] = [];

    // Check for correct letters
    for (
        let i = 0, l = Math.min(subjectLetters.length, targetLetters.length);
        i < l;
        i++
    ) {
        const letterIsCorrect = subjectLetters[i] === targetLetters[i];
        const letterState: KeyState = {
            isClose: false,
            isCorrect: letterIsCorrect,
            isRedundant: false,
        };
        returnArray.push(letterState);

        if (letterIsCorrect) {
            targetLettersClone.splice(
                targetLettersClone.indexOf(subjectLetters[i]),
                1,
            );
        }
    }

    // Check for close and redundant letters
    for (
        let i = 0, l = Math.min(subjectLetters.length, targetLetters.length);
        i < l;
        i++
    ) {
        if (!returnArray[i].isCorrect) {
            const letterIsClose =
                targetLettersClone.indexOf(subjectLetters[i]) > -1;
            returnArray[i].isClose = letterIsClose;
            returnArray[i].isRedundant = !letterIsClose;

            if (letterIsClose) {
                targetLettersClone.splice(
                    targetLettersClone.indexOf(subjectLetters[i]),
                    1,
                );
            }
        }
    }

    return returnArray;
};
