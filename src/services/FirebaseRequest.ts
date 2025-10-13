"use server"

import { GoogleAuth } from 'google-auth-library';
import QuestionsFormatter from '../types/QuestionsResponseType';

export async function callGetQuestions(): Promise<QuestionsFormatter[]> {
    const auth = new GoogleAuth({
        credentials: {
            type: process.env.GOOGLE_TYPE,
            project_id: process.env.GOOGLE_PROJECT_ID,
            private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_CLIENT_ID,
            // auth_uri: process.env.GOOGLE_AUTH_URI,
            // token_uri: process.env.GOOGLE_TOKEN_URI,
            // auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
            // client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
            universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
        }
    });

    const targetAuience = `https://${process.env.GOOGLE_CLOUD_REGION}-${process.env.GOOGLE_PROJECT_ID}.cloudfunctions.net/${process.env.ROUTE_GET_QUESTIONS}`;
    const client = await auth.getIdTokenClient(targetAuience);
    
    const res: any = await client.request({url: targetAuience, method: "GET"});
    
    return res.data;
}

export async function callGetLevel(payload: any): Promise<any> {
    const auth = new GoogleAuth({
        credentials: {
            type: process.env.GOOGLE_TYPE,
            project_id: process.env.GOOGLE_PROJECT_ID,
            private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            client_id: process.env.GOOGLE_CLIENT_ID,
            // auth_uri: process.env.GOOGLE_AUTH_URI,
            // token_uri: process.env.GOOGLE_TOKEN_URI,
            // auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
            // client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
            universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
        }
    });

    const targetAuience = `https://${process.env.GOOGLE_CLOUD_REGION}-${process.env.GOOGLE_PROJECT_ID}.cloudfunctions.net/${process.env.ROUTE_GET_LEVEL}`;
    const client = await auth.getIdTokenClient(targetAuience);

    const res: any = await client.request({url: targetAuience, method: "POST", data: payload});
    
    return res;
}