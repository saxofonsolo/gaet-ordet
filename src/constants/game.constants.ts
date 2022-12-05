import { KeyState } from "../interfaces/LetterState.interface";

export const WORD_GUESS_COUNT = 6;
export const DEFAULT_KEY_STATE: KeyState = {
    isCorrect: false,
    isClose: false,
    isRedundant: false,
    disabled: false,
    forbidden: false,
};
