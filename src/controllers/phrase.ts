interface PhraseResponse {
    statusCode: Number,
    statusMessage: string,
    body: Object
}

export default class PhraseController {
    public async getMessage(): Promise<PhraseResponse> {
      return {
          statusCode: 200,
          statusMessage: "OK",
          body: { message: "yay" }
      };
    }
  }