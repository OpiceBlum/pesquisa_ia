'use client'

export default function Question(props: any)
{
    const responses: any = props.question.responses || [];

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const refId: string = e.currentTarget.value;
        const element: any = document.getElementById(refId);

        element.checked = true;
        props.onCheckedChange(element.name)
    }

    return(
        <div className="question-block">
            <h3>{props.counter}. {props.question.description}</h3>
            <div className="options" >
                {responses.map((res:any) => (
                    <button className="option" onClick={handleClick} value={`q${props.counter}${res.weight}`} key={crypto.randomUUID()}>
                        <input type="radio" name={`q${props.counter}`} value={res.weight} id={`q${props.counter}${res.weight}`}/>
                        <label>{res.response}</label>
                    </button>
                ))}
            </div>
        </div>
    );
}