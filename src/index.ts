import dayjs from "dayjs";
import fs from "fs";
import AwsComprehendClient from "./AwsComprehendClient";
import FamilyMartWebParse from "./FamilyMartWebParse";
import TwitterClient from "./TwitterClient";

const execute = async () => {
  // ファミリーマートの新商品を取得
  const html = await FamilyMartWebParse.fetchHtml();
  const newDessertList = await FamilyMartWebParse.getNewDessert(html);

  // スイーツ名のツイートを取得&解析
  const newDessertSummary = await Promise.all(
    newDessertList.map(async (product) => {
      // ツイートを取得
      const searchResults = await TwitterClient.findTweetsBySearchKeyword(`-RT ${product.name}`);
      // Tweetのポジティブ度を算出
      const positiveRent = await AwsComprehendClient.getPositiveRate(searchResults.tweets);
      return {
        name: product.name,
        price: product.price,
        searchResults,
        positiveRent,
      };
    })
  );

  // ファイルに保存
  fs.writeFileSync(`./reports/${dayjs().unix()}__report.json`, JSON.stringify(newDessertSummary));
};

export default execute();
