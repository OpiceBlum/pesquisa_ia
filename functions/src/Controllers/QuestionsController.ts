import QuestionsFormatter from "./../types/QuestionsResponseType";
import Database from "../config/database";
export default class QuestionsController {
    async getAll(): Promise<QuestionsFormatter[]> { 
        const db = new Database()
        const data:any = await db.fetchQuestions();

        
        const sortedData = this.sort(data);
        return sortedData;
    }


    private sort(data: any): any {
        if(data.length <= 1) return data;

        let pivot = data.pop();

        let left: any = [];
        let right: any = [];

        data.forEach((item:any) => {
            item.index < pivot.index ? left.push(item) : right.push(item);
        });

        return [...this.sort(left), pivot, ...this.sort(right)];
    }
}