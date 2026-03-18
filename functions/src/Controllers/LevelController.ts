//import {logger} from "firebase-functions";
import Database from "../config/database";
import EmailService from "../services/Email";
import Templates from "../services/Templates";

type levelStyles = {
    className: String;
}

export type levelResponse = {
    level: number;
    spanTitle: String;
    title: String;
    score: number;
    totalScore: number;
    minScore: number;
    descriptionLevel: String;
    plan: Array<String>;
    nextSteps: String;
    styles: levelStyles;
}

export default class LevelController {
    async getLevelByScore(score:number, email?: string): Promise<levelResponse[]> {
        const db = new Database();

        const data = await db.getLevelByScore(score);

        if(email) {
            const plans = data[0].plan.map((item: string) => {
                return {"desc": item};
            });
            
            const contents = {
                spanTitle: data[0].spanTitle,
                level: data[0].id,
                title: data[0].title,
                score: score,
                minScore: 10,
                totalScore: 40,
                descriptionLevel: data[0].descriptionLevel,
                plan: plans,
                className: `risk-assessment ${data[0].styles.className}`
            }
            const html = new Templates("email", "Response", contents);
            let mailer = new EmailService(email,"Opice Blum - Diagnóstico de uso de IA", html.load());
            // Recuperar template da resposta
            mailer.send();
        }

        return data;
    }

    async getResultByEca(questions:any, email?:string): Promise<any> {
        //validar regras
        let result:any = []

        
        result.push(this.validRules(questions))
        if(email) {
            const contents = {
                spanTitle: result[0].spanTitle,
                descriptionLevel: result[0].descriptionLevel,
                what: result[0].what,
                descPlan: result[0].descPlan,
                plan: result[0].plan.map((item: string) => ({ desc: item })),
                hasPlan: result[0].plan.length > 0,
                footer: result[0].footer,
                className: `risk-assessment ${result[0].styles.className}`
            }
            const html = new Templates("email", "ResponseISF", contents);
            let mailer = new EmailService(email,"Opice Blum - Pesquisa de ISF", html.load());
            // Recuperar template da resposta
            mailer.send();
        }
        return result

        
    }

    validRules(data:any) {
        console.log(data)

        const q2Count = data.q2.value; // quantidade de itens marcados em Q2 (0-4)
        const q6Robust = data.q6.value > 1; // validação robusta = documental/terceiro/biométrica/outro (valores > 1)

        // Regra 1 – Direcionamento a menores (Q1)
        // Q1 = "Sim, exclusivamente" (1) ou "Sim, como parte relevante" (2) => Aplicável
        if (data.q1.value == 1 || data.q1.value == 2) {
            return this.rulesOfECA(0);
        }

        // Regra 3 – Q9 = "Sim" (perfilamento de menores para publicidade) => Aplicável (gatilho forte)
        if (data.q9.value == true) {
            return this.rulesOfECA(0);
        }

        // Regra 2 – Não direcionado, mas com indicativos de uso por menores (Q2)
        // Q1 = "Não" e Q2 >= 2 itens => Provável Aplicabilidade
        if (data.q1.value == 3 && q2Count >= 2) {
            return this.rulesOfECA(1);
        }

        // Q1 = "Não" e Q2 <= 1 => seguir para Regras 3 a 5
        if (data.q1.value == 3 && q2Count <= 1) {

            // Regra 3 – Perfis de risco e engajamento (Q4 + Q9)
            // Q4 = "Sim" e Q2 == 1 => Provável Aplicabilidade
            if (data.q4.value == true && q2Count == 1) {
                return this.rulesOfECA(1);
            }

            // Regra 4 – Verificação de idade (Q5 + Q6)
            // Q5 = "Não" (não solicita idade) e Q2 >= 1 => Provável Aplicabilidade
            if (data.q5.value == false && q2Count >= 1) {
                return this.rulesOfECA(1);
            }

            // Q5 = "Sim" e Q6 = "autodeclaração simples" e Q2 >= 1 => Provável Aplicabilidade
            if (data.q5.value == true && !q6Robust && q2Count >= 1) {
                return this.rulesOfECA(1);
            }

            // Q5 = "Sim" e Q6 robusta e Q2 = 0 => seguir para Regras 5 e 6
            if (data.q5.value == true && q6Robust && q2Count == 0) {

                // Regra 5 – Conteúdo sensível (Q3)
                // Q3 = "Sim" e Q2 >= 1 => Provável Aplicabilidade
                // (Nota: q2Count == 0 neste bloco, então esta condição não será atingida aqui)

                // Regra 6 – Cenário de baixa exposição
                // Q1="Não", Q2=0, Q4="Não", Q5="Sim" + Q6 robusta, Q3="Não", Q9="Não" => Não Aplicável
                if (data.q4.value == false && data.q3.value == false && data.q9.value == false) {
                    return this.rulesOfECA(2);
                }
            }

            // Regra 5 – Conteúdo sensível (Q3)
            // Q3 = "Sim" e Q2 >= 1 => Provável Aplicabilidade
            if (data.q3.value == true && q2Count >= 1) {
                return this.rulesOfECA(1);
            }

            // Q3 = "Sim" e Q2 = 0 => disparar disclaimer de atividade de risco
            if (data.q3.value == true && q2Count == 0) {
                return this.rulesOfECA(3);
            }
        }

        // Fallback: Não Aplicável Direto
        return this.rulesOfECA(2);
    }

    rulesOfECA(id:number) {
        const rules:any = [
            { // 0 - Aplicável ao ECA Digital (Adequação Obrigatória)
                spanTitle: 'Aplicável ao ECA Digital (Adequação Obrigatória)',
                descriptionLevel: 'O seu serviço se enquadra nas hipóteses de incidência do ECA Digital! Portanto, há obrigações legais específicas para operação junto ao público potencialmente infantojuvenil que devem ser cumpridas.',
                what: "As respostas mostram elementos estruturais que, segundo a nova lei, exigem mecanismos formais de governança etária, proteção por padrão, revisão de fluxos, políticas e processos internos. Entretanto, o grau e a forma dessas adequações dependem de uma análise técnica detalhada do seu modelo de negócio, arquitetura de produto e práticas de dados.",
                descPlan: "Para definir exatamente quais ajustes serão necessários, com qual profundidade e em qual sequência, é recomendável conduzir uma avaliação jurídica especializada. Essa análise permitirá:",
                plan: [
                    "mapear obrigações específicas aplicáveis ao seu serviço",
                    "identificar riscos regulatórios prioritários",
                    "estabelecer o nível adequado de verificação etária e salvaguardas",
                    "orientar ajustes de design, coleta de dados, publicidade e moderação de conteúdo"
                ],
                footer: "Nossa equipe está à disposição para apoiá-los nessa avaliação e no plano de conformidade completo para entrada em vigor do ECA Digital.",
                styles: {
                    className: 'high_risk'
                }
            },
            { // 1 - Provável Aplicabilidade (Adequação Recomendada)
                spanTitle: 'Provável Aplicabilidade (Adequação Recomendada)',
                descriptionLevel: "Há possibilidade relevante de o ECA Digital se aplicar ao seu serviço, seja por atratividade ao público menor, riscos identificados ou ausência de barreiras etárias suficientes.",
                what: "Seu negócio pode não ser direcionado a menores, mas apresenta elementos que a autoridade regulatória costuma considerar como vetores de incidência. Para determinar se a adequação será obrigatória ou recomendável, é necessária uma avaliação contextualizada do serviço, jornadas, dados tratados e funcionalidades.",
                descPlan: "Recomenda-se realizar uma análise aprofundada de risco e enquadramento, que permitirá:",
                plan: [
                    "confirmar se o ECA Digital se aplica ao seu caso",
                    "identificar quais áreas precisariam de ajustes (se houver)",
                    "entender o impacto regulatório sobre marketing, produto, dados e UX",
                    "definir medidas proporcionais ao nível real de risco"
                ],
                footer: "Estamos à disposição auxiliar sua empresa conduzindo esse diagnóstico especializado para garantir segurança jurídica e evitar sobrecarga de implementação desnecessária.",
                styles: {
                    className: 'medium-risk'
                }
            },
            { // 2 - Não Aplicável Direto (Boas Práticas Recomendadas)
                spanTitle: 'Não Aplicável Direto (Boas Práticas Recomendadas)',
                descriptionLevel: 'Com base nas informações fornecidas, o ECA Digital não se aplica de forma direta ao seu serviço.',
                what: "Mesmo fora do escopo direto, empresas têm buscado revisões preventivas para reduzir riscos reputacionais, adequar linguagem e garantir que menores não utilizem o serviço inadvertidamente, especialmente em contextos B2B2C, plataformas abertas ou produtos com marketing digital de amplo alcance.",
                descPlan: "Uma revisão objetiva, porém estratégica, pode fortalecer sua segurança jurídica através de:",
                plan: [
                    "termos e políticas mais claros sobre faixa etária",
                    "mecanismos proporcionais de prevenção de acesso indevido por menores",
                    "ajustes em comunicação e UX para evitar interpretação equivocada de direcionamento"
                ],
                footer: "Estamos à disposição para mapear com sua equipe quais desses pontos fazem sentido no seu caso e sugerir melhorias sob medida.",
                styles: {
                    className: 'low-risk'
                }
            },
            { // 3 - Disclaimer de Atividade de Risco
                spanTitle: 'Aviso sobre Atividade de Risco',
                descriptionLevel: 'As respostas indicam a presença de funcionalidades ou conteúdos classificados como de risco para o público infantojuvenil sob o ECA Digital (ex.: conteúdos sensíveis, mecânicas de engajamento intenso, interações abertas ou coleta sensível).',
                what: "Esse tipo de atividade tende a exigir salvaguardas mais rigorosas, e a definição das medidas adequadas depende de uma avaliação jurídica e técnica individualizada, considerando modelo de negócio, arquitetura de dados, exposição a terceiros e natureza das interações.",
                descPlan: "Recomendamos uma análise especializada, pois as obrigações podem variar significativamente conforme o contexto e a exposição do seu serviço.",
                plan: [],
                footer: "",
                styles: {
                    className: 'medium-risk'
                }
            }
        ]

        return rules[id]
    }
}