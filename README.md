# Solar MCP

MCP (Model Context Protocol) server for Upstage Solar Pro2 and Solar Mini models.

## Installation

```bash
npm install solar-mcp
```

Or build locally:

```bash
git clone https://github.com/serithemage/solar-mcp.git
cd solar-mcp
npm install
npm run build
```

## Configuration

### Environment Variables

```bash
export UPSTAGE_API_KEY="your-api-key"
```

> **Note:** If `UPSTAGE_API_KEY` is set as an environment variable, you can omit the `env` section in the configuration file.

### Claude Code Setup

Add the MCP server using Claude Code CLI:

```bash
claude mcp add solar -- npx solar-mcp
```

With environment variable:

```bash
claude mcp add solar -e UPSTAGE_API_KEY=your-api-key -- npx solar-mcp
```

Verify configuration:

```bash
claude mcp list
```

### Claude Desktop Setup

Add to `~/.config/claude/claude_desktop_config.json` (macOS/Linux) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "solar": {
      "command": "npx",
      "args": ["solar-mcp"],
      "env": {
        "UPSTAGE_API_KEY": "your-api-key"
      }
    }
  }
}
```

If the API key is set as an environment variable, you can omit the `env` section:

```json
{
  "mcpServers": {
    "solar": {
      "command": "npx",
      "args": ["solar-mcp"]
    }
  }
}
```

## Features

### Tools

#### solar_chat

Send chat completion requests to Solar models.

**Parameters:**

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| messages | array | Y | Array of messages [{role, content}] |
| model | string | N | Model selection (default: solar-pro2) |
| temperature | number | N | Creativity control (0-2) |
| max_tokens | number | N | Maximum tokens to generate |
| top_p | number | N | Nucleus sampling threshold |
| stop | array | N | Stop sequences |
| stream | boolean | N | Enable streaming (default: true) |

**Usage Example:**

```text
Use the solar_chat tool to say "Hello"
```

### Resources

#### solar://usage

Returns API usage statistics for the current session.

```json
{
  "total_prompt_tokens": 100,
  "total_completion_tokens": 200,
  "total_tokens": 300,
  "request_count": 5
}
```

#### solar://models

Returns a list of available Solar models.

```json
[
  {
    "id": "solar-pro2",
    "name": "Solar Pro2",
    "description": "Upstage Solar Pro2 - High performance model"
  },
  {
    "id": "solar-mini",
    "name": "Solar Mini",
    "description": "Upstage Solar Mini - Fast and efficient model"
  }
]
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

## Requirements

- Node.js 22+
- Upstage API key (get one at [console.upstage.ai](https://console.upstage.ai))

## License

MIT
