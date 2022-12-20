import "dotenv/config";
import { Client } from "twitter-api-sdk";
import { env } from "./constant/env";

class TwitterClient {
  client: Client;
  constructor() {
    this.client = new Client(env.TWITTER_BEARER_TOKEN);
  }

  /**
   * 最近のツイータを取得
   * @param searchKeyword 検索キーワード
   * @param maxResults 最大取得件数
   * @returns
   */
  async findTweetsBySearchKeyword(searchKeyword: string, maxResults: number = 10) {
    // https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent
    const { data, meta } = await this.client.tweets.tweetsRecentSearch({
      query: searchKeyword,
      // maxResultsが10件以下の場合、10件にする
      max_results: maxResults >= 10 ? maxResults : 10,
    });

    return {
      tweets: data?.map((tweet) => tweet.text) ?? [],
      resultCount: meta?.result_count ?? 0,
    };
  }
}

export default new TwitterClient();
