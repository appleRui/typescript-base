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

  async getNewDessert(html: string) {
    const newDessertList: Product[] = [];
    const SEARCH_VALUE = '\n\t\t\t\t\t\t\t\t\t\t';
    const DESSERT_CATEGORIES = ['デザート', '和菓子', '焼き菓子', 'コーヒー・フラッペ'];

    const $ = children.load(html);
    const newProductElements = $('.ly-mod-infoset4-link');

    newProductElements.map((_, element) => { 
      const productCategory = $(element).find('.ly-mod-infoset4-cate').text().replace(SEARCH_VALUE, '');
      if (!DESSERT_CATEGORIES.includes(productCategory)) return;

      const productName = $(element).find('.ly-mod-infoset4-ttl').text().replace(SEARCH_VALUE, '');
      const productPrice = $(element).find('.ly-mod-infoset4-txt > span').text().replace(SEARCH_VALUE, '');
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