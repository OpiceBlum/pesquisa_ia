import * as axios from 'axios';
import qs from "qs";
import * as msal from '@azure/msal-node';

export default class MicrosoftClient {
    private accessToken: string;
    private cca: msal.ConfidentialClientApplication;

    constructor(
        public clientId: string,
        public clientSecret: string,
        public tenantId: string,
        public redirectUrl?: string,
    ) { 
        this.accessToken = '';

        const clientConfig = {
            "auth": {
                "clientId": clientId,
                "authority": `https://login.microsoftonline.com/${this.tenantId}`,
                "clientSecret": clientSecret
            }
        }
        
        this.cca = new msal.ConfidentialClientApplication(
            clientConfig
        );
    }

    public async sendMailWithGraphApi(options: any): Promise<void> {

        const request = {
            scopes: ["https://graph.microsoft.com/.default"],
            clientId: process.env.MAIL_CLIENT_ID_SENDER
        }
        await this.cca.acquireTokenByClientCredential(request)

        const endpoint = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(options.from)}/sendMail`;

        console.log("E-mail: " + options.from);
        const message:any = {
            message: {
                subject: options.subject,
                body: {
                    contentType: 'HTML',
                    content: options.html
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: options.to, 
                            name: options.to.split("@")[0]
                        }
                    }
                ]
            },
            saveToSentItems: true
        };

        await this.getAccessToken();

        try{
            const response = await axios.post(endpoint, message, {
                    headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
            });

        } catch (err:any) {
            throw new Error(err.response.data.error.code + " - " + err.response.data.error.message)
        }

        
    }

    private async getAccessToken(): Promise<void> {
        const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
        const data = qs.stringify({
            grant_type: 'client_credentials',
            client_id: this.clientId,
            client_secret: this.clientSecret,
            scope: 'https://graph.microsoft.com/.default'
        });

        const resp:any = await axios.post(tokenUrl, data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })

        this.accessToken = resp.data.access_token as string;
    }
}