import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import QuestionsController from "./Controllers/QuestionsController";
import LevelController from "./Controllers/LevelController";

setGlobalOptions({ maxInstances: 10 });

export const getQuestions = onRequest(
  {cors: [/firebase\.com$/, /127.0.0.1/]}, 
  async (request, response) => {
    if(request.method != 'GET') {
      response.status(405).send();
    }

    if((request.headers.authorization?.split(' '))?.[1] != process.env.NEXT_PUBLIC_AUTHORIZATION) {
      response.status(401).send();
    }

    logger.info("Iniciando requisição GetQuestions!", {structuredClone: true});
    const controller = new QuestionsController();
    let res;

    res = await controller.getAll();

    response.send(res);
  }
)

export const getLevel = onRequest(
  {cors: [/firebase\.com$/, /127.0.0.1/]}, 
  async (request, response) => {
  if(request.method != 'POST') {
    response.status(405).send();
  }

  if((request.headers.authorization?.split(' '))?.[1] != process.env.NEXT_PUBLIC_AUTHORIZATION) {
    response.status(401).send();
  }

  const {score} = request.body;
  const controller = new LevelController();

  const result = await controller.getLevelByScore(Number(score));

  response.send(result.pop());

})