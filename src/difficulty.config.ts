import { DifficultyConfig, DifficultyLevel } from "./types/Difficulty";

export const difficulties: DifficultyConfig = {
    [DifficultyLevel.EASY]: {
        pipeIntervalRange: [750, 1750],
        pipeGapRange: [200, 325],
        pipeVelocity: -350,
    },
    [DifficultyLevel.NORMAL]: {
        pipeIntervalRange: [500, 1200],
        pipeGapRange: [175, 300],
        pipeVelocity: -450,
    },
    [DifficultyLevel.HARD]: {
        pipeIntervalRange: [350, 900],
        pipeGapRange: [150, 275],
        pipeVelocity: -550,
    },
}