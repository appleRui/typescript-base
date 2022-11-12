import "dotenv/config";
import { Client } from "twitter-api-sdk";

// TwitterAPI v2 Search Tweets
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent
class TwitterClient {
  client: Client;
  constructor() {
    this.client = new Client(process.env.TWITTER_BEARER_TOKEN ?? "");
  }

  /**
   * 最近のツイータを取得
   * @param searchKeyword 検索キーワード
   * @param maxResults 最大取得件数
   * @returns
   */
  async recentSearch(searchKeyword: string, maxResults?: number) {
    const { data, meta } = await this.client.tweets.tweetsRecentSearch({
      query: searchKeyword,
      max_results: maxResults ?? 10, // デフォルトの最小件数が10件
    });
    return {
      tweets: data?.map((tweet) => tweet.text) ?? [],
      resultCount: meta?.result_count ?? 0,
    };
  }
}

export default new TwitterClient();
