import 'dotenv/config'
import { RequestOptions } from 'https';
import { Client } from "twitter-api-sdk";

// TwitterAPI v2 Search Tweets
// https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent
class TwitterClient {
  client: Client;
  constructor() {
    this.client = new Client(process.env.TWITTER_BEARER_TOKEN ?? '');
  }

  /**
   * 最近のツイータを取得
   * @param searchKeyword 検索キーワード 
   * @param maxResults 最大取得件数
   * @returns 
   */
  async recentSearch(searchKeyword: string, maxResults? : number) {
    return await this.client.tweets.tweetsRecentSearch({
      query: searchKeyword,
      max_results: maxResults ?? 10
    })
  }
}

export default new TwitterClient();