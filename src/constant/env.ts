export const env = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN ?? "",
} as const;
