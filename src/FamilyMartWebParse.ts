import axios from "axios";
import children from "cheerio";

type Product = {
  category: string;
  name: string;
  price: string;
}

class FamilyMartWebParse {
  private URL = "https://www.family.co.jp/goods/newgoods.html";

  async fetchHtml(): Promise<string> {
    const { data: html } = await axios.get(this.URL);
    return html;
  }

  findByClassAttribute(element: cheerio.Cheerio, selector: string) {
    const SEARCH_VALUE = '\n\t\t\t\t\t\t\t\t\t\t';
    return element.find(selector).text().replace(SEARCH_VALUE, '');
  }

  async getNewDessert(html: string) {
    const newDessertList: Product[] = [];
    const DESSERT_CATEGORIES = ['デザート', '和菓子', '焼き菓子', 'コーヒー・フラッペ'];

    const $ = children.load(html);
    const newProductElements = $('.ly-mod-infoset4-link');

    newProductElements.map((_, element) => { 
      const productCategory = this.findByClassAttribute($(element), '.ly-mod-infoset4-cate');
      if (!DESSERT_CATEGORIES.includes(productCategory)) return;

      const productName = this.findByClassAttribute($(element), '.ly-mod-infoset4-ttl');
      const productPrice = this.findByClassAttribute($(element), '.ly-mod-infoset4-txt > span');
      newDessertList.push({
        category: productCategory,
        name: productName,
        price: productPrice,
      })
    });
    return newDessertList;
  }
}

export default new FamilyMartWebParse();