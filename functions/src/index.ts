import {logger, setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";

import QuestionsController from "./Controllers/QuestionsController";
import LevelController from "./Controllers/LevelController";

setGlobalOptions({ maxInstances: 10 });

export const getQuestions = onRequest(
  {cors: true}, 
  async (request, response) => {
    logger.debug("[DEBUG] GetQuestions - Iniciando Requisição.");
    if(request.method != 'GET') {
      response.status(405).send();
    }

    const controller = new QuestionsController();
    let res;

    res = await controller.getAll();
  

    response.header({"contentType": "application/json"}).send(res);
  }
)

export const getLevel = onRequest(
  {cors: true}, 
  async (request, response) => {
    logger.debug("[DEBUG] GetLevel - Iniciando Requisição.");
    if(request.method != 'POST') {
      response.status(405).send();
    }

    const {score, email} = request.body;
    const controller = new LevelController();

    const result = await controller.getLevelByScore(Number(score), email);

    response.send(result.pop());

})