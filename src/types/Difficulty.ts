export type DifficultyConfig = {[key in DifficultyLevel]: Difficulty }

export interface Difficulty {
    pipeIntervalRange: [number, number];
    pipeGapRange: [number, number];
    pipeVelocity: number;
}

export enum DifficultyLevel {
    EASY = 'easy',
    NORMAL = 'normal',
    HARD = 'hard',
}
