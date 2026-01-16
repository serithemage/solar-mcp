import { API_BASE_URL, DEFAULT_MODEL } from "./common/types.js";

export interface Config {
  apiKey: string;
  apiBaseUrl: string;
  defaultModel: string;
}

export function loadConfig(): Config {
  const apiKey = process.env.UPSTAGE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "UPSTAGE_API_KEY environment variable is required. " +
        "Please set it with your Upstage API key."
    );
  }

  return {
    apiKey,
    apiBaseUrl: process.env.UPSTAGE_API_URL || API_BASE_URL,
    defaultModel: process.env.UPSTAGE_DEFAULT_MODEL || DEFAULT_MODEL,
  };
}
