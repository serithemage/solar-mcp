import { UpstageClient } from "../common/api-client.js";
import { DEFAULT_MODEL, ChatCompletionUsage } from "../common/types.js";
import { SolarChatParams, SolarChatResult } from "./types.js";

export const SOLAR_CHAT_TOOL_NAME = "solar_chat";

export const SOLAR_CHAT_TOOL_DESCRIPTION = `Send a chat completion request to Upstage Solar models.

Available models:
- solar-pro2: High performance model (default)
- solar-mini: Fast and efficient model

Returns the model's response along with token usage statistics.`;

export const SOLAR_CHAT_INPUT_SCHEMA = {
  type: "object" as const,
  properties: {
    messages: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          role: {
            type: "string" as const,
            enum: ["system", "user", "assistant"],
            description: "The role of the message author",
          },
          content: {
            type: "string" as const,
            description: "The content of the message",
          },
        },
        required: ["role", "content"],
      },
      description: "Array of messages in the conversation",
    },
    model: {
      type: "string" as const,
      description: "Model to use (solar-pro2 or solar-mini). Defaults to solar-pro2",
    },
    temperature: {
      type: "number" as const,
      description: "Sampling temperature (0-2). Higher values make output more random",
      minimum: 0,
      maximum: 2,
    },
    max_tokens: {
      type: "number" as const,
      description: "Maximum number of tokens to generate",
    },
    top_p: {
      type: "number" as const,
      description: "Nucleus sampling parameter (0-1)",
      minimum: 0,
      maximum: 1,
    },
    stop: {
      type: "array" as const,
      items: { type: "string" as const },
      description: "Stop sequences to end generation",
    },
    stream: {
      type: "boolean" as const,
      description: "Whether to stream the response. Defaults to true",
    },
  },
  required: ["messages"],
};

export class UsageTracker {
  private totalPromptTokens = 0;
  private totalCompletionTokens = 0;
  private requestCount = 0;

  addUsage(usage: ChatCompletionUsage): void {
    this.totalPromptTokens += usage.prompt_tokens;
    this.totalCompletionTokens += usage.completion_tokens;
    this.requestCount++;
  }

  getStats() {
    return {
      total_prompt_tokens: this.totalPromptTokens,
      total_completion_tokens: this.totalCompletionTokens,
      total_tokens: this.totalPromptTokens + this.totalCompletionTokens,
      request_count: this.requestCount,
    };
  }

  reset(): void {
    this.totalPromptTokens = 0;
    this.totalCompletionTokens = 0;
    this.requestCount = 0;
  }
}

export async function executeSolarChat(
  client: UpstageClient,
  params: SolarChatParams,
  usageTracker: UsageTracker,
  onProgress?: (content: string) => void
): Promise<SolarChatResult> {
  const model = params.model || DEFAULT_MODEL;
  const shouldStream = params.stream !== false;

  if (shouldStream && onProgress) {
    let fullContent = "";
    let usage: ChatCompletionUsage | undefined;
    let finishReason: string | null = null;

    for await (const chunk of client.chatCompletionStream({
      model,
      messages: params.messages,
      temperature: params.temperature,
      max_tokens: params.max_tokens,
      top_p: params.top_p,
      stop: params.stop,
      stream: true,
    })) {
      const choice = chunk.choices[0];
      if (choice?.delta?.content) {
        fullContent += choice.delta.content;
        onProgress(choice.delta.content);
      }
      if (choice?.finish_reason) {
        finishReason = choice.finish_reason;
      }
      if (chunk.usage) {
        usage = chunk.usage;
      }
    }

    const finalUsage = usage || {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    };

    usageTracker.addUsage(finalUsage);

    return {
      content: fullContent,
      model,
      usage: finalUsage,
      finish_reason: finishReason,
    };
  } else {
    const response = await client.chatCompletion({
      model,
      messages: params.messages,
      temperature: params.temperature,
      max_tokens: params.max_tokens,
      top_p: params.top_p,
      stop: params.stop,
      stream: false,
    });

    usageTracker.addUsage(response.usage);

    const choice = response.choices[0];
    return {
      content: choice?.message?.content || "",
      model: response.model,
      usage: response.usage,
      finish_reason: choice?.finish_reason || null,
    };
  }
}
