type QuestionsFormatter = {
    Description: String,
    responses: ResponseQuestion[]
};

type ResponseQuestion = {
    response: string
    weight: number
}

export default QuestionsFormatter;