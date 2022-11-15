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
      // maxResultsがundefinedの場合、10件にする
      // maxResultsが10件以下の場合、10件にする
      max_results: (maxResults ?? 10) >= 10 ? maxResults : 10,
    });
    console.log(`${searchKeyword} is results`, data);
    return {
      tweets: data?.map((tweet) => tweet.text) ?? [],
      resultCount: meta?.result_count ?? 0,
    };
  }
}

export default new TwitterClient();
