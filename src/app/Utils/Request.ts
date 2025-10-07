import axios from 'axios';
import QuestionsFormatter from '../../types/QuestionsResponseType';

export default class Request
{
    static async getQuestions(): Promise<QuestionsFormatter[]>{
        try{
            const response = await axios.get<QuestionsFormatter[]>(`${process.env.NEXT_PUBLIC_API_URL}/getQuestions`, {
                headers: {
                    'Accept': "application/json",
                    "ContentType": "Application/json",
                    "Authorization": `Baerer ${process.env.NEXT_PUBLIC_AUTHORIZATION}`
                }
            });
            return response.data;
        }catch(error) {
            console.error(error)
            throw error;
        }
    }

    static async getLevel(score: number): Promise<any> {
        const payload:any = {
            "score": score
        }

        try{
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/getLevel`, payload, {
                headers: {
                    "Accept": "application/json",
                    "ContentType": "application/json",
                    "Authorization": `Baerer ${process.env.NEXT_PUBLIC_AUTHORIZATION}`
                }
            });

            const statErrTemplate = /40*/
            return !statErrTemplate.test(String(response.status)) ? response.data : null;
        }catch(err) {
            console.error(err);
        }
    }
}