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
    

    if(request.query['eca'] == 'true') {
      res = await controller.getAllEca();
    } else {
      res = await controller.getAll();
    }
  

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



    const result = request.query['eca'] ? await controller.getResultByEca(request.body.questions, email) : await controller.getLevelByScore(Number(score), email);

    logger.debug("Resultado")
    logger.debug(result)
    response.send(result.pop());

})