import axios, { AxiosError, AxiosInstance } from "axios";

class Http {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://jsonplaceholder.typicode.com'
    });
  };

  private handleError(): (reason: any) => PromiseLike<never> {
    return (e: AxiosError) => {
      console.error('Error', JSON.stringify(e));
      throw e;
    };
  }

  async findAll<T>(apiUrl: string) {
    const response = await this.instance.get<T>(apiUrl).catch(this.handleError());
    return response.data;
  }

  async findByUserId<T>(apiUrl: string) {
    const response = await this.instance.get<T>(apiUrl).catch(this.handleError());
    return response.data;
  }
}

export default new Http;