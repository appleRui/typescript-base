import FamilyMartWebParse from "./FamilyMartWebParse";
import TwitterClient from "./TwitterClient";

const exec = async () => {
  // ファミマのサイトから今週のスイーツ情報を取得
  const html = await FamilyMartWebParse.fetchHtml();
  const newDessertList = await FamilyMartWebParse.getNewDessert(html);

  // スイーツ名のツイートを取得
  const newDessertSummaryWithTweetsList = await Promise.all(
    newDessertList.map(async (product) => {
    return {
      category: product.category,
      name: product.name,
      price: product.price,
      tweets: await TwitterClient.recentSearch(`ファミマ ${product.name}`, 10)
    }
    }));
  console.log(JSON.stringify(newDessertSummaryWithTweetsList));
}

exec();