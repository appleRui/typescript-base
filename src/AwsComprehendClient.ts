import {
  ComprehendClient,
  BatchDetectSentimentCommand,
  BatchDetectSentimentCommandOutput,
  BatchDetectSentimentItemResult,
} from "@aws-sdk/client-comprehend";
import { fromIni } from "@aws-sdk/credential-providers";

const REGION = "ap-northeast-1";
class AwsComprehendClient {
  private client: ComprehendClient;

  constructor() {
    this.client = new ComprehendClient({
      region: REGION,
      // PCにあるIAM情報を取得
      credentials: fromIni({ profile: "personal-comprehend-account" }),
    });
  }

  private positiveScore(resultList: BatchDetectSentimentItemResult[] | undefined) {
    if (!resultList) return 0;
    const sentiments = resultList.map((result) => {
      console.log(result);
      return result.Sentiment ?? "Any";
    });
    return sentiments.find((sentiment) => sentiment === "POSITIVE")?.length ?? 0;
  }

  async analyze(values: string[]) {
    const parameter = { TextList: values, LanguageCode: "ja" };
    const command = new BatchDetectSentimentCommand(parameter);
    const analyzeResult: BatchDetectSentimentCommandOutput = await this.client.send(command).catch((e) => {
      // Please use a smaller number of items in a single batch. Maximum batch size is 25.
      throw new Error(e);
    });
    if (analyzeResult.ErrorList?.length ?? 0 > 0)
      analyzeResult.ErrorList?.map((error) => console.error("Error❗️", error.ErrorMessage));
    return this.positiveScore(analyzeResult.ResultList);
  }
}

export default new AwsComprehendClient();
