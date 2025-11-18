import Handlebars from "handlebars";
import * as fs from "fs";

export default class Templates
{
    constructor(
        public folderTemplate: string,
        public templateName: string,
        public data: any,
    ) { }

    load() {
        const source: string | NonSharedBuffer = this.getFile();
        const template = Handlebars.compile(source);

        return template(this.data); 
    }

    getFile(): string | NonSharedBuffer {
        const file = fs.readFileSync(process.cwd() + `/src/views/${this.folderTemplate}/template/${this.templateName}.html`);

        return file.toString();
    }
}