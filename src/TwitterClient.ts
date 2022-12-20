import "dotenv/config";
import { Client } from "twitter-api-sdk";

class TwitterClient {
  private readonly client: Client;

  constructor() {
    this.client = new Client(process.env.TWITTER_BEARER_TOKEN ?? "");
  }

  /**
   * 最近のツイータを取得
   * @param searchKeyword 検索キーワード
   * @param maxResults 最大取得件数
   * @returns ツイートの配列
   */
  async findTweetsBySearchKeyword(searchKeyword: string) {
    // https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent
    const { data, meta } = await this.client.tweets.tweetsRecentSearch({
      query: searchKeyword,
    });

    return {
      tweets: data?.map((tweet) => tweet.text) ?? [],
      resultCount: meta?.result_count ?? 0,
    };
  }
}

export default new TwitterClient();
