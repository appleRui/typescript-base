import {
  ComprehendClient,
  BatchDetectSentimentCommand,
  BatchDetectSentimentCommandOutput,
  SentimentType,
} from "@aws-sdk/client-comprehend";
import { env } from "./constant/env";

const REGION = "ap-northeast-1";

class AwsComprehendClient {
  private client: ComprehendClient;

  constructor() {
    this.client = new ComprehendClient({
      region: REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private async analyze(values: string[]) {
    const parameter = { TextList: values, LanguageCode: "ja" };
    const command = new BatchDetectSentimentCommand(parameter);
    const analyzeResult: BatchDetectSentimentCommandOutput = await this.client.send(command).catch((e) => {
      // Please use a smaller number of items in a single batch. Maximum batch size is 25.
      throw new Error(e);
    });
    if (analyzeResult.ErrorList?.length ?? 0 > 0)
      analyzeResult.ErrorList?.map((error) => console.error("Error❗️", error.ErrorMessage));
    return analyzeResult.ResultList;
  }

  async computedPositiveScore(values: string[]) {
    const resultList = await this.analyze(values);
    if (!resultList) return 0;

    const sentiments = resultList.map((result) => {
      return result.Sentiment ?? SentimentType.MIXED;
    });
    return sentiments.find((sentiment) => sentiment === SentimentType.POSITIVE)?.length ?? 0;
  }
}

export default new AwsComprehendClient();
