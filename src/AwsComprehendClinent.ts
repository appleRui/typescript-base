import { ComprehendClient, BatchDetectDominantLanguageCommand } from "@aws-sdk/client-comprehend";

class AwsComprehendClient {
  constructor(){
    const client = new ComprehendClient({ region: "REGION" });
  }
}

export default new AwsComprehendClient();