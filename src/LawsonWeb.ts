import axios from "axios";
import children from "cheerio";

type Product = {
  name: string;
  price: string;
  url: string;
};

// ローソンのデザート商品一覧URL
const URL = "https://www.lawson.co.jp/recommend/original/dessert/";
const ORIGIN = "https://www.lawson.co.jp";

class LawsonWeb {
  /**
   * ローソンのデザートデザート一覧ページのHTMLを取得
   * @returns HTML
   */
  async fetchHtml(): Promise<string> {
    const { data: html } = await axios.get<string>(URL);
    return html;
  }

  /**
   * 指定したクラス属性を持つ要素を取得
   * @param element HTML要素
   * @param selector セレクター
   * @returns 要素のテキスト
   */
  findElementByClassAttribute(element: cheerio.Cheerio, selector: string) {
    const SEARCH_VALUE = "\n\t\t\t\t\t\t\t\t\t\t";
    return element.find(selector).text().replace(SEARCH_VALUE, "");
  }

  /**
   * 新発売の商品かどうかを判定
   * @param element HTML要素
   * @returns 新発売かどうか
   */
  hasNewProductLabel(element: cheerio.Cheerio) {
    const SEARCH_VALUE = "\n\t\t\t\t\t\t\t\t\t\t";
    return element.find(".ico_new").text().replace(SEARCH_VALUE, "") === "新発売";
  }

  /**
   * 新発売のデザート商品を取得
   * @param html HTML
   * @returns 新発売のデザート商品リスト
   */
  async getNewDessert(html: string) {
    const newDessertList: Product[] = [];

    const $ = children.load(html);
    const newProductElements = $(".heightLineParent > li");

    newProductElements.map((_, element) => {
      if (!this.hasNewProductLabel($(element))) return;

      const productName = this.findElementByClassAttribute($(element), ".ttl");
      const productPrice = this.findElementByClassAttribute($(element), ".price > span");
      const productUrl = $(element).find(".img > a").attr("href");
      newDessertList.push({
        name: productName,
        price: productPrice,
        url: ORIGIN + productUrl,
      });
    });
    return newDessertList;
  }
}

export default new LawsonWeb();
