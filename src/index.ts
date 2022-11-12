import dayjs from "dayjs";
import fs from "fs";
import AwsComprehendClient from "./AwsComprehendClient";
import FamilyMartWebParse from "./FamilyMartWebParse";
import TwitterClient from "./TwitterClient";

const exec = async () => {
  // ファミマのサイトから今週のスイーツ情報を取得
  const html = await FamilyMartWebParse.fetchHtml();
  const newDessertList = await FamilyMartWebParse.getNewDessert(html);

  // スイーツ名のツイートを取得 & 解析
  const newDessertSummary = await Promise.all(
    newDessertList.map(async (product, index) => {
      // Tweetを取得
      const searchResult = await TwitterClient.recentSearch(`ファミマ ${product.name}`, 25);
      // 文字解析
      const positiveScore = await AwsComprehendClient.analyze(searchResult.tweets);
      return {
        category: product.category,
        name: product.name,
        price: product.price,
        searchResult,
        positiveScore,
      };
    })
  );

  // JSONに書き出す
  fs.writeFileSync(`./reports/${dayjs().unix()}__report.json`, JSON.stringify(newDessertSummary));
};

exec();
