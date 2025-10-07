'use client'

import { useEffect, useRef } from "react";

type levelStyles = {
    className: String;
}

export type PropsMaturity = {
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

function PlanItem(props: any) {
    return (
        <li>{props.desc}</li>
    )
}

export default function MaturityLevel(props?: PropsMaturity|undefined) {
    const maturityLevelRef:any = useRef(null);

    useEffect(() => {

      if(maturityLevelRef.current) {
        maturityLevelRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, []);
    return (
        <>
            <div id="result" ref={maturityLevelRef} className="result" style={{"display": "block"}}>
                <h3>{props?.spanTitle}</h3>
                <div className="cmmi-level">
                  <h5>Nível de Maturidade Organizacional</h5>
                  <p><strong>Nível {props?.level} - {props?.title}</strong></p>
                  <p style={{"fontSize": "0.9em", "marginTop": "10px"}}>Pontuação: {props?.score} pontos (de {props?.minScore} a {props?.totalScore})</p>
                </div>
                <div className={"risk-assessment " + props?.styles.className}>
                  <p>{props?.descriptionLevel}</p>
                </div>
                <div className="recommendations">
                  <h4>Plano de Ação Específico</h4>
                  <ul>
                    {props?.plan.map((item) => 
                        <PlanItem desc={item} key={crypto.randomUUID()}/>
                    )}
                  </ul>
                </div>
                <div className="cta-section">
                  <h4>Próximo Passo Recomendado</h4>
                  <p>{props?.nextSteps}</p>
                </div>
              </div>
        </>
    )
}