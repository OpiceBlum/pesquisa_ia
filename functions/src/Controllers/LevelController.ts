import Database from "../config/database";

type levelStyles = {
    className: String;
}

export type levelResponse = {
    level: number;
    spanTitle: String;
    title: String;
    score: number;
    totalScore: number;
    minScore: number;
    descriptionLevel: String;
    plan: Array<String>;
    nextSteps: String;
    styles: levelStyles;
}

export default class LevelController {
    async getLevelByScore(score:number): Promise<levelResponse[]> {
        const db = new Database();

        const data = await db.getLevelByScore(score);

        return data;

    }
}