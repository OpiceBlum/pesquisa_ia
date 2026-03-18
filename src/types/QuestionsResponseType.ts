type QuestionsFormatter = {
    Description: String
    responses: ResponseQuestion[]
    index: number
};

export type QuestionsECAFormatter = {
    Description: String,
    responses: string | undefined,
    type: String | undefined,
    index: number
}

type ResponseQuestion = {
    response: string
    weight: number
}

export default QuestionsFormatter;