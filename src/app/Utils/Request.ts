"use server"

import QuestionsFormatter, {QuestionsECAFormatter} from '../../types/QuestionsResponseType';
import {callGetCalc, callGetLevel, callGetQuestions} from '../../services/FirebaseRequest';

export async function getQuestions(): Promise<QuestionsFormatter[]>{
    try{    
        const response: any = await callGetQuestions();

        return response;
    }catch(error) {
        console.error(error)
        throw error;
    }
}

export async function getQuestionsEca(): Promise<QuestionsECAFormatter[]>{
    try{    
        const response: any = await callGetQuestions(true);

        return response;
    }catch(error) {
        console.error(error)
        throw error;
    }
}


export async function getLevel(score: number, email?: string): Promise<any> {
    
    const payload:any = {
        "score": score,
        "email": email
    }

    try{
        const response: any = await callGetLevel(payload);
        const statErrTemplate = /40*/;

        return !statErrTemplate.test(String(response.status)) ? response.data : null;
    }catch(err) {
        console.error(err);
    }
}

export async function calc(questions:any, email?:string): Promise<any> {
    const payload = {
        'questions': questions,
        'email': email
    }

    const response: any = await callGetCalc(payload)
    const statErrTemplate = /40*/

    return !statErrTemplate.test(String(response.status)) ? response.data : null;
}