const EnvMail = {
    service: process.env.MAIL_SERVICE || "mailtrap",
    host: process.env.MAIL_HOST || "",
    port: Number(process.env.MAIL_PORT) || 587,
    user: process.env.MAIL_USER || "",
    pass: process.env.MAIL_PASS || "",
    secure: Boolean(process.env.MAIL_SECURE) || false,
    mailFrom: process.env.MAIL_FROM || "comunicacao@opiceblum.com.br"
}


export default EnvMail;