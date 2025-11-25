'use client'

import Form from 'next/form';
import Image from "next/image";
import Question from './components/Question';
import React, { useEffect, useState } from 'react';
import {getLevel, getQuestions} from './Utils/Request';
import QuestionsFormatter from '../types/QuestionsResponseType';
import MaturityLevel from './components/MaturityLevel';

export default function Home() {

  const [questions, setQuestions] = useState([{}]);
  const [level, setLevel]:any = useState(null);
  let responsedQuestions: Array<String> = [];
  const [maxscore, setMaxscore] = useState(0);
  let counter = 1;
  const [score, setScore] = useState(0);
  const [email, setEmail] = useState("");

  const [formEmailVisible, setFormEmailVisible] = useState('block');

  // => Carrega questões na construção da tela 
  useEffect(() => {
    async function fetchData() {
      let response: QuestionsFormatter[] =  await getQuestions();
      setQuestions(response);
    }

    fetchData();
  }, []);

  // => Ao receber uma resposta
  const onQuestionSelected = async (id: string) => {
    const item: HTMLInputElement|null = document.querySelector(`input[name="${id}"]:checked`);
  
    if(!item) return;

    if(!responsedQuestions.includes(item.name)) {
      
      responsedQuestions.push(item.name);
      
      if(responsedQuestions.length === questions.length) {
        handleSubmitQuestions();
      }
    }
  }

  const handleSubmitQuestions = async () => {
    const items: NodeListOf<HTMLInputElement>|null = document.querySelectorAll(`input[type="radio"]:checked`);
    setMaxscore(document.querySelectorAll("input[type='radio']").length);
    let total: number = 0;
    // resgata valores
    items.forEach((item) => {
      total += parseInt(item.value);
    });

    // conforme o total, carrega a classificação por faixa
    setScore(total);

    setLevel(await getLevel(total, email));

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
                  <h3 className="modal-title">Antes de continuar</h3>
                  <button type="button" className="modal-close-btn" data-modal-hide="default-modal" onClick={handleCloseEmail}>
                    <svg className="modal-close-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                    </svg>
                    
                  </button>
                </div>
                
                <Form action="#" id="formEmail" onSubmit={handleSubmitEmail}>
                  <div className="modal-body">
                    <p className="modal-text">
                      Informe seu E-mail para que possamos, ao final do questionário encaminhar a resposta para sua caixa de entrada.
                    </p>
                    <p className="modal-text">
                      Caso não ache necessário, feche e continue
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
              <h1>Diagnóstico: descubra se sua empresa precisa de governança de IA</h1>
              <p>Responda 10 perguntas sobre o uso de Inteligência Artificial na sua organização e receba uma avaliação preliminar com recomendações para o seu nível de maturidade</p>
              
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
                <MaturityLevel 
                  descriptionLevel={level.descriptionLevel} 
                  level={level.id} 
                  minScore={questions.length} 
                  nextSteps={level.nextSteps}
                  plan={level.plan}
                  score={score}
                  spanTitle={level.spanTitle}
                  styles={level.styles}
                  title={level.title}
                  totalScore={maxscore}
                  />
              }
          </div>
      </div>

      
    </main>
  );
}
