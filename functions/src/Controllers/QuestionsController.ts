import QuestionsFormatter from "./../types/QuestionsResponseType";
import Database from "../config/database";
export default class QuestionsController {
    async getAll(): Promise<QuestionsFormatter[]> { 
        const db = new Database()
        const data:any = await db.fetchQuestions();
        return data;
    }
}