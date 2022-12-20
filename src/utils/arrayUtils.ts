/**
 * 配列を指定したサイズごとに分割する関数
 * @param chunkSize 分割するサイズ
 * @param values 分割する配列
 * @returns 分割された配列
 */
export const splitArrayIntoChunks = (chunkSize: number, values: string[]): string[][] => {
  const result: string[][] = [];
  for (let i = 0; i < Math.ceil(values.length / chunkSize); i++) {
    result.push(values.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  return result;
};
