#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { loadConfig } from "./config.js";
import { UpstageClient } from "./common/api-client.js";
import { SOLAR_MODELS } from "./common/types.js";
import {
  SOLAR_CHAT_TOOL_NAME,
  SOLAR_CHAT_TOOL_DESCRIPTION,
  SOLAR_CHAT_INPUT_SCHEMA,
  UsageTracker,
  executeSolarChat,
} from "./chat/tool.js";
import { SolarChatParams } from "./chat/types.js";

async function main() {
  const config = loadConfig();
  const client = new UpstageClient(config.apiKey, config.apiBaseUrl);
  const usageTracker = new UsageTracker();

  const server = new Server(
    {
      name: "solar-mcp",
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
      },
    }
  );

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: SOLAR_CHAT_TOOL_NAME,
          description: SOLAR_CHAT_TOOL_DESCRIPTION,
          inputSchema: SOLAR_CHAT_INPUT_SCHEMA,
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === SOLAR_CHAT_TOOL_NAME) {
      try {
        const params = args as unknown as SolarChatParams;

        if (!params.messages || !Array.isArray(params.messages)) {
          return {
            content: [
              {
                type: "text" as const,
                text: "Error: messages parameter is required and must be an array",
              },
            ],
            isError: true,
          };
        }

        const result = await executeSolarChat(
          client,
          params,
          usageTracker,
          undefined // No streaming progress callback in basic mode
        );

        return {
          content: [
            {
              type: "text" as const,
              text: result.content,
            },
          ],
          _meta: {
            model: result.model,
            usage: result.usage,
            finish_reason: result.finish_reason,
          },
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: "text" as const,
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Unknown tool: ${name}`,
        },
      ],
      isError: true,
    };
  });

  // List available resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: "solar://usage",
          name: "Usage Statistics",
          description: "Current session API usage and token statistics",
          mimeType: "application/json",
        },
        {
          uri: "solar://models",
          name: "Available Models",
          description: "List of available Solar models",
          mimeType: "application/json",
        },
      ],
    };
  });

  // Handle resource reads
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    if (uri === "solar://usage") {
      const stats = usageTracker.getStats();
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    }

    if (uri === "solar://models") {
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(SOLAR_MODELS, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown resource: ${uri}`);
  });

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
