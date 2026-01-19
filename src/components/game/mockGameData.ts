export interface GameSection {
    id: string;
    title: string;
    content: string[];
    choices: GameChoice[];
}

export interface GameChoice {
    id: string;
    number: number;
    text: string;
    description: string;
    requirement?: string;
    nextSectionId: string;
}

export const mockGameData: GameSection = {
    id: 'cave-entrance',
    title: 'The Cave Entrance',
    content: [
        'You stand before the yawning mouth of the crystal caverns, your torch flickering in the cold mountain air. Local legends speak of incredible treasures hidden within, but also of the many adventurers who never returned.',
        'The entrance is partially blocked by fallen rocks, but you can see three possible ways to proceed: a narrow gap to the left that glows with an eerie blue light, a wider opening straight ahead that disappears into absolute darkness, or you could attempt to clear some of the fallen rocks to create your own path.',
        'Your backpack contains rope, a torch, some dried provisions, and a small crystal pendant your grandmother gave you for luck. The pendant seems to be glowing faintly as you approach the cave.',
    ],
    choices: [
        {
            id: 'choice-1',
            number: 1,
            text: 'Squeeze through the narrow gap toward the blue light',
            description: 'The blue light might be magical, but the passage looks dangerous',
            nextSectionId: 'blue-light-passage',
        },
        {
            id: 'choice-2',
            number: 2,
            text: 'Head straight into the dark opening with your torch',
            description: 'The main path is unknown, but your torch will provide light',
            nextSectionId: 'dark-passage',
        },
        {
            id: 'choice-3',
            number: 3,
            text: 'Try to clear the rocks and make your own path',
            description: 'This will take time and energy, but might reveal something hidden',
            requirement: 'Strength',
            nextSectionId: 'cleared-path',
        },
    ],
};
