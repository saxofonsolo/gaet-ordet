export const getRandomFromArray = (
    arr: string[],
    exceptions?: string[],
): string => {
    const array = [...arr];
    const filtered = array.filter((value) => !exceptions?.includes(value));
    return filtered[
        Math.min(
            filtered.length - 1,
            Math.max(0, Math.floor(Math.random() * array.length)),
        )
    ];
};
