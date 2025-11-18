"use server"

import axios from 'axios';
import QuestionsFormatter from '../../types/QuestionsResponseType';
import {callGetLevel, callGetQuestions} from '../../services/FirebaseRequest';

export async function getQuestions(): Promise<QuestionsFormatter[]>{
    try{    
        const response: any = await callGetQuestions();

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