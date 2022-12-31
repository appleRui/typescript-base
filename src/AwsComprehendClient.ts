import "dotenv/config";
import {
  ComprehendClient,
  BatchDetectSentimentCommand,
  BatchDetectSentimentCommandOutput,
  SentimentType,
  BatchDetectSentimentItemResult,
} from "@aws-sdk/client-comprehend";
import { splitArrayIntoChunks } from "./utils/arrayUtils";

const REGION = "ap-northeast-1";

class AwsComprehendClient {
  private readonly client: ComprehendClient;

  /**
   * コンストラクタ
   * 認証を保持しているクライアントを生成する
   */
  constructor() {
    this.client = new ComprehendClient({
      region: REGION,
      credentials: {
        accessKeyId: process.env.COMPREHEND_ACCESS_KEY ?? "",
        secretAccessKey: process.env.COMPREHEND_SECRET_ACCESS_KEY ?? "",
      },
    });
  }

  /**
   * 解析を実行する関数
   * @param fn 解析結果を加工する関数
   * @param values 解析対象の文字列の配列
   * @returns 解析結果
   */
  private async analyze<T>(
    fn: (resultList: BatchDetectSentimentItemResult[]) => Promise<T>,
    values: string[]
  ): Promise<T> {
    const resultList: BatchDetectSentimentItemResult[] = [];
    const separateValuesArray = splitArrayIntoChunks(25, values);
    for (let i = 0; i < separateValuesArray.length; i++) {
      const command = new BatchDetectSentimentCommand({
        TextList: separateValuesArray[i],
        LanguageCode: "ja",
      });
      const analyzeResult: BatchDetectSentimentCommandOutput = await this.client.send(command).catch((e) => {
        throw new Error(e);
      });
      if (analyzeResult.ErrorList?.length ?? 0 > 0)
        analyzeResult.ErrorList?.map((error) => console.error("Error❗️", error.ErrorMessage));
      resultList.push(...(analyzeResult.ResultList ?? []));
    }
    return await fn(resultList);
  }

  /**
   * ポジティブ度を算出する関数
   * @param values 解析対象の文字列の配列
   * @returns ポジティブ度(%)
   */
  async getPositiveRate(values: string[]) {
    return await this.analyze<number>(async (resultList) => {
      const positiveCount = resultList.filter((result) => result.Sentiment === SentimentType.POSITIVE).length;
      return (positiveCount / resultList.length) * 100;
    }, values);
  }
}

export default new AwsComprehendClient();
