'use client'

export default function Question(props: any)
{
    const responses: any = props.question.responses || [];

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const refId: string = e.currentTarget.value;
        const element: any = document.getElementById(refId);

        
        if(element.name == 'qm2') {
            let hideElement:any = document.getElementById('q2_hide')
            setTimeout(() => {
                hideElement.value = document.querySelectorAll('input[name="qm2"]:checked').length
            }, 20);
        }

        element.checked = !element.checked;
        props.onCheckedChange(element.name)
    }

    return(
        <div className="question-block">
            <h3>{props.question.index}. {props.question.description}</h3>
            {(props.question.type !== 'Boolean' && props.question.type !== 'multiselect' ) &&
                <div className="options" >
                    {responses.map((res:any) => (
                        <button className="option" onClick={handleClick} value={`q${props.counter}${res.weight}`} key={crypto.randomUUID()}>
                            <input type="radio" name={`q${props.counter}`} value={res.weight} id={`q${props.counter}${res.weight}`}/>
                            <label className='question_text'>{res.response}</label>
                        </button>
                    ))}
                </div>
            }

            {props.question.type == 'Boolean' &&
                <div className="options" >
                    <button className="option" onClick={handleClick} value={`q${props.counter}_true`} key={crypto.randomUUID()}>
                        <input type="radio" name={`q${props.counter}`} value='false' id={`q${props.counter}_true`}/>
                        <label className='question_text'>Sim</label>
                    </button>
                    <button className="option" onClick={handleClick} value={`q${props.counter}_false`} key={crypto.randomUUID()}>
                        <input type="radio" name={`q${props.counter}`} value='false' id={`q${props.counter}_false`}/>
                        <label className='question_text'>Não</label>
                    </button>
                </div>
            }

            {props.question.type == 'multiselect' &&
                <div className="options" >
                    {responses.map((res:any) => (
                        <button className="option" onClick={handleClick} value={`qm${props.counter}${res.weight}`} key={crypto.randomUUID()}>
                            <input type="checkbox" name={`qm${props.counter}`} value={res.weight} id={`qm${props.counter}${res.weight}`}/>
                            <label className='question_text'>{res.response}</label>
                        </button>
                    ))}

                    <input type='hidden' name={`q${props.counter}_hide`} id={`q${props.counter}_hide`} value={0} checked/>
                </div>
            }
        </div>
    );
}