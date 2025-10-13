"use server"

import axios from 'axios';
import QuestionsFormatter from '../../types/QuestionsResponseType';
import {callGetLevel, callGetQuestions} from '../../services/FirebaseRequest';

export async function getQuestions(): Promise<QuestionsFormatter[]>{
    let route:string = `${process.env.NEXT_PUBLIC_API_URL}/getQuestions`;

    if(process.env.NEXT_PUBLIC_NODE_ENV == 'PROD') {
        route = process.env.NEXT_PUBLIC_ROUTE_GET_QUESTIONS||route
    }
    
    try{    
        const response: any = await callGetQuestions();

        console.log(response)
        return response;
    }catch(error) {
        console.error(error)
        throw error;
    }
}


export async function getLevel(score: number): Promise<any> {
    
    const payload:any = {
        "score": score
    }

    try{
        const response: any = await callGetLevel(payload);
        const statErrTemplate = /40*/;

        return !statErrTemplate.test(String(response.status)) ? response.data : null;
    }catch(err) {
        console.error(err);
    }
}