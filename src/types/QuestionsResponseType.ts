type QuestionsFormatter = {
    Description: String
    responses: ResponseQuestion[]
    index: number
};

type ResponseQuestion = {
    response: string
    weight: number
}

export default QuestionsFormatter;