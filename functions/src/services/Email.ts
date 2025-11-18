

import EnvMail from "../config/env/Mail";
import { createTransport, Transporter } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

export default class EmailService {

    constructor(
        public to: string,
        public subject: string,
        public message: string
    ) { }

    getTransport():Transporter {
        let transportOptions: any;

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

            console.log(`[DEBUG] - E-mail: Serviço selecionado: ${EnvMail.service}`)
            
            return createTransport(transportOptions);
    }
     
    async send():Promise<void> {
        try{
            console.log("[DEBUG] - E-mail: Iniciando serviço de disparo de email")
            const options: MailOptions = {
                from: EnvMail.mailFrom,
                to: this.to,
                subject: this.subject,
                html: this.message
            }
            const transporter = this.getTransport();

            console.log("[DEBUG] - E-mail: Enviando...")
            await transporter.sendMail(options);

            console.log("[DEBUG] - E-mail: Email disparado com sucesso")

        } catch(err) {
            console.error(err);
            throw Error("[DEBUG] - E-mail: Não foi possível enviar o email");
        }
    }
}