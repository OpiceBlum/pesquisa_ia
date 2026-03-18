'use client'

import { useEffect, useRef } from "react";

type levelStyles = {
    className: String;
}

export type PropsApplication = {
    spanTitle: String;
    descriptionLevel: String;
    what: String;
    descPlan: String;
    plan: Array<String>;
    footer: String;
    styles: levelStyles;
}

function PlanItem(props: any) {
    return (
        <li>{props.desc}</li>
    )
}

export default function ApplicationLevel(props?: PropsApplication|undefined) {
    const applicationLevelRef:any = useRef(null);

    useEffect(() => {

      if(applicationLevelRef.current) {
        applicationLevelRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    }, []);
    return (
        <>
            <div id="result" ref={applicationLevelRef} className="result" style={{"display": "block"}}>
                <h3>{props?.spanTitle}</h3>
                <div className={"risk-assessment " + props?.styles.className}>
                  <p>{props?.descriptionLevel}</p>
                </div>
                <div className="recommendations">
                  <h4>O que isso significa</h4>
                  <p>{props?.what}</p>
                </div>

                {props?.plan && props.plan.length > 0 &&
                  <div className="recommendations">
                    <h4>Próximos passos sugeridos</h4>
                    <p>{props?.descPlan}</p>
                    <ul>
                      {props?.plan.map((item) =>
                          <PlanItem desc={item} key={crypto.randomUUID()}/>
                      )}
                    </ul>
                  </div>
                }

                {props?.plan && props.plan.length == 0 &&
                  <div className="recommendations">
                    <p>{props?.descPlan}</p>
                  </div>
                }

                {props?.footer &&
                  <div className="cta-section">
                    <p>{props?.footer}</p>
                  </div>
                }
            </div>
        </>
    )
}
