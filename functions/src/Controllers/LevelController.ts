import Database from "../config/database";
import EmailService from "../services/Email";
import Templates from "../services/Templates";

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
    async getLevelByScore(score:number, email?: string): Promise<levelResponse[]> {
        const db = new Database();

        const data = await db.getLevelByScore(score);

        if(email) {
            const plans = data[0].plan.map((item: string) => {
                return {"desc": item};
            });
            
            const contents = {
                spanTitle: data[0].spanTitle,
                level: data[0].id,
                title: data[0].title,
                score: score,
                minScore: 10,
                totalScore: 40,
                descriptionLevel: data[0].descriptionLevel,
                plan: plans,
                className: `risk-assessment ${data[0].styles.className}`
            }
            const html = new Templates("email", "Response", contents);
            let mailer = new EmailService(email,"Opice Blum - Diagnóstico de uso de IA", html.load());
            // Recuperar template da resposta
            mailer.send();
        }

        return data;
    }
}