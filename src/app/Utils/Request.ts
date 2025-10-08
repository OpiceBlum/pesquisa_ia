import axios from 'axios';
import QuestionsFormatter from '../../types/QuestionsResponseType';

export default class Request
{
    static async getQuestions(): Promise<QuestionsFormatter[]>{
        let route:string = `${process.env.NEXT_PUBLIC_API_URL}/getQuestions`;

        if(process.env.NEXT_PUBLIC_NODE_ENV == 'PROD') {
            route = process.env.NEXT_PUBLIC_ROUTE_GET_QUESTIONS||route
        }

        try{
            const response = await axios.get<QuestionsFormatter[]>(route, {
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
        let route:string = `${process.env.NEXT_PUBLIC_API_URL}/getLevel`;

        if(process.env.NEXT_PUBLIC_NODE_ENV == 'PROD') {
            route = process.env.NEXT_PUBLIC_ROUTE_GET_LEVEL||route
        }
        
        const payload:any = {
            "score": score
        }

        try{
            const response = await axios.post(route, payload, {
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