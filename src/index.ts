import dayjs from "dayjs";
import fs from "fs";
import AwsComprehendClient from "./AwsComprehendClient";
import FamilyMartWebParse from "./FamilyMartWebParse";
import LawsonWebParse from "./LawsonWebParse";
import TwitterClient from "./TwitterClient";

const execute = async () => {
  // ファミマのサイトから今週のスイーツ情報を取得
  const html = await LawsonWebParse.fetchHtml();
  const newDessertList = await LawsonWebParse.getNewDessert(html);

  // スイーツ名のツイートを取得 & 解析
  const newDessertSummary = await Promise.all(
    newDessertList.map(async (product, index) => {
      // Tweetを取得
      const searchResult = await TwitterClient.recentSearch(`UchiCafe`, 50);
      // 文字解析
      const positiveScore = await AwsComprehendClient.analyze(searchResult.tweets);
      return {
        name: product.name,
        price: product.price,
        searchResult,
        // positiveScore,
      };
    })
  );

  // JSONに書き出す
  fs.writeFileSync(`./reports/${dayjs().unix()}__report.json`, JSON.stringify(newDessertSummary));
};

export default execute();
