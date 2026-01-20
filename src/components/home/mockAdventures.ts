import { type Adventure } from './AdventureCard';

export const mockAdventures: Adventure[] = [
    {
        path: 'the-crystal-caverns.json',
        title: 'The Crystal Caverns',
        author: 'Elena Brightwater',
        description:
            'Deep beneath the mountain lies a network of crystal caves filled with ancient magic and dangerous creatures. Your choices will determine whether you emerge as a hero or become another lost soul in the depths.',
        difficulty: 'Medium',
        genre: 'Fantasy',
        duration: '45-60 min',
        chapters: 12,
        tags: ['Magic', 'Underground', 'Crystals'],
    },
    {
        path: 'pirates-of-the-jade-sea.json',
        title: 'Pirates of the Jade Sea',
        author: 'Captain Blackwater',
        description:
            'Set sail on the treacherous Jade Sea where pirates rule and treasure awaits the bold. Navigate through storms, rival crews, and ancient curses in this swashbuckling adventure.',
        difficulty: 'Easy',
        genre: 'Adventure',
        duration: '30-45 min',
        chapters: 8,
        tags: ['Pirates', 'Ocean', 'Treasure'],
    },
    {
        path: 'the-last-wizards-tower.json',
        title: "The Last Wizard's Tower",
        author: 'Sage Moonshadow',
        description:
            "The realm's last wizard has vanished, leaving behind only his tower and a terrible curse spreading across the land. Uncover the secrets within and decide the fate of magic itself.",
        difficulty: 'Hard',
        genre: 'High Fantasy',
        duration: '60-90 min',
        chapters: 18,
        tags: ['Wizards', 'Magic', 'Tower'],
    },
];
