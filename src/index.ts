import FamilyMartWebParse from "./FamilyMartWebParse";

// 実行する関数
const exec = async () => {
  const html = await FamilyMartWebParse.fetchHtml();
  const newDessertList = await FamilyMartWebParse.getNewDessert(html);
  console.log(newDessertList)
}

exec();