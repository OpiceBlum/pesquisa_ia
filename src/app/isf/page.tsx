'use client'

import Form from 'next/form';
import Image from "next/image";
import Question from '../components/Question';
import React, { useEffect, useState, FormEvent } from 'react';
import {calc, getLevel, getQuestionsEca} from '../Utils/Request';
import QuestionsFormatter, { QuestionsECAFormatter } from '../../types/QuestionsResponseType';
import ApplicationLevel from '../components/ApplicationLevel';

export default function ISF() {

  const [questions, setQuestions] = useState([{}]);
  const [level, setLevel]:any = useState(null);
  let responsedQuestions: Array<String> = [];
  const [maxscore, setMaxscore] = useState(0);
  let counter = 1;
  const [score, setScore] = useState(0);
  const [email, setEmail] = useState("");

  const [formEmailVisible, setFormEmailVisible] = useState('block');

  useEffect(() => {
    document.title = 'Diagnóstico de aplicação do ECA Digital';
  });

  // => Carrega questões na construção da tela
  useEffect(() => {
    async function fetchData() {
      let response: QuestionsECAFormatter[] =  await getQuestionsEca();
      setQuestions(response);
    }

    fetchData();
  }, []);

  // => Ao receber uma resposta
  const onQuestionSelected = async (id: string) => {
    let item: HTMLInputElement|null = document.querySelector(`input[name="${id}"]:checked`);

    if(id.includes('qm')){
      item = document.querySelector(`input[name="q2_hide"]`);
    }

    console.log(item)

    if(!item) return;

    if(!responsedQuestions.includes(item.name)) {


      responsedQuestions.push(item.name);

      if(responsedQuestions.length === questions.length) {
        handleSubmitQuestions();
      }
    }
  }

  const handleSubmitQuestions = async () => {

    const items: NodeListOf<HTMLInputElement>|null = document.querySelectorAll(`input:checked`);
    setMaxscore(document.querySelectorAll("input[type='radio']").length);
    let total: number = 0;
    
    let questions:any = {}


    items.forEach((item:any) => {
      let value = item.value
      if(item.value == 'false') {
        value = false
      } else if(item.value == 'true') {
        value = true
      }

      if(!item.id.includes('qm')){
        questions[String(item.id).substring(0,2)] = {"value": value}
      }
    })

    let q2:any = document.getElementById('q2_hide')
    questions['q2'] = {"value": q2.value}
    
    setLevel(await calc(questions, email));

  }

  const handleCloseEmail = () => {
    setFormEmailVisible("none");
  }

  const handleSubmitEmail = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const mail: any = document.getElementById("email");

    if(String(mail.value).length > 1) {
      setEmail(String(mail.value));
    }

    handleCloseEmail()
  }

  return (
    <main className="content">
      <div className='logoOpice'>
        <Image
          src='/img/Logo_Branco.png'
          alt=''
          width={135}
          height={50}
          style={{position: 'absolute', 'top': "25px"}}
        />
      </div>
      <div className="container">
            <div id="default-modal" tabIndex={-1} aria-hidden="true" className="modal" style={{"display": formEmailVisible}}>
            <div className="modal-container">
              <div className="modal-content">

                <div className="modal-header">
                  <h3 className="modal-title">Quer receber o resultado por e-mail?</h3>
                  <button type="button" className="modal-close-btn" data-modal-hide="default-modal" onClick={handleCloseEmail}>
                    <svg className="modal-close-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>

                  </button>
                </div>

                <Form action="#" id="formEmail" onSubmit={handleSubmitEmail}>
                  <div className="modal-body">
                    <p className="modal-text">
                      Informe abaixo e enviaremos assim que você finalizar.
                    </p>
                    <p className="modal-text">
                      Se preferir não receber, é só fechar e continuar.
                    </p>

                      <input type="email" name={`email`} className='moda-input-email' id={`email`}/>

                      <div className="modal-footer">
                        <button data-modal-hide="default-modal" type="submit" className="btn-accept">Confirmar</button>
                        <button data-modal-hide="default-modal" type="button" onClick={handleCloseEmail} className="btn-decline">Continuar sem E-mail</button>
                      </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>

          <div className="header">
              <h1>Pesquisa de ISF</h1>
              <p>O presente formulário tem por objetivo identificar se a sua empresa deve se adequar às obrigações do Estatuto Digital da Criança e do Adolescente (&quotECA Digital&quot). Como a lei entrará em vigor em 17 de março de 2026, é muito importante que a sua empresa esteja atenta ao tema!</p>

              <div className="progress-bar">
                  <div className="progress-fill" id="progressFill"></div>
              </div>
          </div>

          <div className="content">
              <Form action='#' id="assessmentForm">

                  <div className="section-header">
                      <h2>Adoção e Estratégia de IA</h2>
                      <p>Avalie como sua organização está utilizando Inteligência Artificial</p>
                  </div>


                  {questions.map((item) => (
                    <div key={crypto.randomUUID()}>
                      { counter == 5 &&
                        <div className="section-header">
                          <h2>Gestão de Riscos e Conformidade</h2>
                          <p>Avalie como sua organização gerencia riscos e conformidade relacionados à IA</p>
                        </div>
                      }

                      { counter == 8 &&
                        <div className="section-header">
                          <h2>Estrutura Organizacional</h2>
                          <p>Avalie a estrutura organizacional para gestão de IA</p>
                      </div>
                      }


                      <Question question={item} counter={counter++}  key={crypto.randomUUID()} onCheckedChange={(id: string) => onQuestionSelected(id)} />
                    </div>
                    ))}

              </Form>

              {level &&
                <ApplicationLevel
                  spanTitle={level.spanTitle}
                  descriptionLevel={level.descriptionLevel}
                  what={level.what}
                  descPlan={level.descPlan}
                  plan={level.plan}
                  footer={level.footer}
                  styles={level.styles}
                  />
              }
          </div>
      </div>


    </main>
  );
}
