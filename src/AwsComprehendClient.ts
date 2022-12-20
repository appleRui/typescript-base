import {
  ComprehendClient,
  BatchDetectSentimentCommand,
  BatchDetectSentimentCommandOutput,
  BatchDetectSentimentItemResult,
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

  private computedPositiveScore(resultList: BatchDetectSentimentItemResult[] | undefined) {
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
    return this.computedPositiveScore(analyzeResult.ResultList);
  }
}

export default new AwsComprehendClient();
