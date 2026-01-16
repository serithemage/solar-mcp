export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  stop?: string[];
  stream?: boolean;
}

export interface ChatCompletionChoice {
  index: number;
  message: ChatMessage;
  finish_reason: string | null;
}

export interface ChatCompletionUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage: ChatCompletionUsage;
}

export interface StreamDelta {
  role?: string;
  content?: string;
}

export interface StreamChoice {
  index: number;
  delta: StreamDelta;
  finish_reason: string | null;
}

export interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: StreamChoice[];
  usage?: ChatCompletionUsage;
}

export interface SolarModel {
  id: string;
  name: string;
  description: string;
}

export const SOLAR_MODELS: SolarModel[] = [
  {
    id: "solar-pro2",
    name: "Solar Pro2",
    description: "Upstage Solar Pro2 - High performance model",
  },
  {
    id: "solar-mini",
    name: "Solar Mini",
    description: "Upstage Solar Mini - Fast and efficient model",
  },
];

export const DEFAULT_MODEL = "solar-pro2";
export const API_BASE_URL = "https://api.upstage.ai/v1";
