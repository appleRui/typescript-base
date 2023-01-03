import dayjs from "dayjs";
import fs from "fs";
import AwsComprehendClient from "./AwsComprehendClient";
import LawsonWeb from "./LawsonWeb";
import TwitterClient from "./TwitterClient";

const execute = async () => {
  // ファミリーマートの新商品を取得
  const html = await LawsonWeb.fetchHtml();
  const newDessertList = await LawsonWeb.getNewDessert(html);
  // スイーツ名のツイートを取得&解析
  const newDessertSummary = await Promise.all(
    newDessertList.map(async (product) => {
      // ツイートを取得
      const searchResults = await TwitterClient.findTweetsBySearchKeyword(`-RT ${product.name}`, 50);
      // Tweetのポジティブ度を算出
      const positiveRate = await AwsComprehendClient.getPositiveRate(searchResults.tweets);
      return {
        name: product.name,
        price: product.price,
        url: product.url,
        searchResults,
        positiveRate,
      };
    })
  );

  // ポジティブ度が高いスイーツ
  const bestDessert = newDessertSummary.sort((a, b) => b.positiveRate - a.positiveRate)[0];
  console.log(
    `
【今週のベストスイーツ】
商品名: ${bestDessert.name}
価格: ${bestDessert.price}
URL: ${bestDessert.url}
ポジティブ度: ${bestDessert.positiveRate.toFixed(1)}%
`
  );

  // レポートを保存
  fs.writeFileSync(`./reports/${dayjs().unix()}__report.json`, JSON.stringify(newDessertSummary));
};

export default execute();
