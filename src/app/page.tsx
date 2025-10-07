'use client'

import Form from 'next/form';
import Image from "next/image";
import Question from './components/Question';
import { useEffect, useState } from 'react';
import Request from './Utils/Request';
import QuestionsFormatter from '../types/QuestionsResponseType';
import MaturityLevel from './components/MaturityLevel';

export default function Home() {

  const [questions, setQuestions] = useState([{}]);
  const [level, setLevel]:any = useState(null);
  let responsedQuestions: Array<String> = [];
  const [maxscore, setMaxscore] = useState(0);
  let counter = 1;
  const [score, setScore] = useState(0);

  // => Carrega questões na construção da tela 
  useEffect(() => {
    async function fetchData() {
      let response: QuestionsFormatter[] =  await Request.getQuestions();
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

    setLevel(await Request.getLevel(total));

  }

  return (
    <main className="content">
      <div className='logoOpice'>
        <Image 
          src='/img/Logo_Branco.png'
          alt=''
          width={190}
          height={70}
          style={{position: 'absolute'}}
        />
      </div>
      <div className="container">
          <div className="header">
              <h1>Diagnóstico: descubra se sua empresa precisa de governança de IA</h1>
              <p>Responda 10 perguntas sobre o uso de Inteligência Artificial na sua organização e receba uma avaliação com recomendações para o seu nível de maturidade</p>
              
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
