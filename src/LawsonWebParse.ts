import axios from "axios";
import children from "cheerio";

type Product = {
  name: string;
  price: string;
};

class LawsonWebParse {
  // ローソンのデザート商品一覧URL
  private URL = "https://www.lawson.co.jp/recommend/original/dessert/";

  async fetchHtml(): Promise<string> {
    const { data: html } = await axios.get(this.URL);
    return html;
  }

  findElementByClassAttribute(element: cheerio.Cheerio, selector: string) {
    const SEARCH_VALUE = "\n\t\t\t\t\t\t\t\t\t\t";
    return element.find(selector).text().replace(SEARCH_VALUE, "") ?? false;
  }

  hasNewProductLabel(element: cheerio.Cheerio) {
    const SEARCH_VALUE = "\n\t\t\t\t\t\t\t\t\t\t";
    return element.find(".ico_new").text().replace(SEARCH_VALUE, "") === "新発売";
  }

  async getNewDessert(html: string) {
    const newDessertList: Product[] = [];

    const $ = children.load(html);
    const newProductElements = $(".heightLineParent > li");

    newProductElements.map((_, element) => {
      if (!this.hasNewProductLabel($(element))) return;

      const productName = this.findElementByClassAttribute($(element), ".ttl");
      const productPrice = this.findElementByClassAttribute($(element), ".price > span");
      newDessertList.push({
        name: productName,
        price: productPrice,
      });
    });
    return newDessertList;
  }
}

export default new LawsonWebParse();
