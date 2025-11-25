

import EnvMail from "../config/env/Mail";
import { createTransport, Transporter } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import MicrosoftClient from "./MicrosoftClient";

export default class EmailService {

    constructor(
        public to: string,
        public subject: string,
        public message: string
    ) { }

    async getTransport():Promise<Transporter> {
        let transportOptions: any;

        console.log(`[DEBUG] - E-mail: Serviço selecionado: ${EnvMail.service}`)
        switch(EnvMail.service){
            case "gmail":
                transportOptions = {
                    service: EnvMail.service,
                    auth: {
                        user: EnvMail.user,
                        pass: EnvMail.pass
                    },
                    debug: true
                }
                break;


            default:
            case "mailtrap":
                transportOptions = {
                    host: EnvMail.host,
                    port: EnvMail.port,
                    auth: {
                        user: EnvMail.user,
                        pass: EnvMail.pass
                    },
                    debug: true
                };
                break;
        }
            
            return createTransport(transportOptions);
    }
     
    async send():Promise<void> {
        try{
            console.log("[DEBUG] - E-mail: Iniciando serviço de disparo de email")
            

            switch(EnvMail.service){
                case "office":
                    await this.sendMailWithOffice()
                    break;

                default:
                    await this.sendMail();
                    break;
            }
            

        } catch(err) {
            console.error(err);
            throw Error("[DEBUG] - E-mail: Não foi possível enviar o email");
        }
    }


    async sendMail(): Promise<void> {
        const options: MailOptions = {
            from: EnvMail.mailFrom,
            to: this.to,
            subject: this.subject,
            html: this.message
        }
        const transporter = await this.getTransport();

            console.log("[DEBUG] - E-mail: Enviando...")
            await transporter.sendMail(options);

            console.log("[DEBUG] - E-mail: Email disparado com sucesso")
            return;
    }

    async sendMailWithOffice(): Promise<void> {
        const options: any = {
            from: EnvMail.mailFrom,
            to: this.to,
            subject: this.subject,
            html: this.message
        }

        const connector = new MicrosoftClient(
            process.env.MAIL_CLIENT_ID || "",
            process.env.MAIL_CLIENT_SECRET || "",
            process.env.MAIL_TENANT_ID || ""
        )

        await connector.sendMailWithGraphApi(options);
    }
}