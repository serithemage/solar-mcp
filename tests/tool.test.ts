import { describe, it, expect, beforeEach } from "vitest";
import {
  UsageTracker,
  SOLAR_CHAT_TOOL_NAME,
  SOLAR_CHAT_INPUT_SCHEMA,
} from "../src/chat/tool.js";

describe("UsageTracker", () => {
  let tracker: UsageTracker;

  beforeEach(() => {
    tracker = new UsageTracker();
  });

  it("should initialize with zero values", () => {
    const stats = tracker.getStats();
    expect(stats.total_prompt_tokens).toBe(0);
    expect(stats.total_completion_tokens).toBe(0);
    expect(stats.total_tokens).toBe(0);
    expect(stats.request_count).toBe(0);
  });

  it("should track usage correctly", () => {
    tracker.addUsage({
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
    });

    const stats = tracker.getStats();
    expect(stats.total_prompt_tokens).toBe(10);
    expect(stats.total_completion_tokens).toBe(20);
    expect(stats.total_tokens).toBe(30);
    expect(stats.request_count).toBe(1);
  });

  it("should accumulate usage across multiple calls", () => {
    tracker.addUsage({
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
    });
    tracker.addUsage({
      prompt_tokens: 15,
      completion_tokens: 25,
      total_tokens: 40,
    });

    const stats = tracker.getStats();
    expect(stats.total_prompt_tokens).toBe(25);
    expect(stats.total_completion_tokens).toBe(45);
    expect(stats.total_tokens).toBe(70);
    expect(stats.request_count).toBe(2);
  });

  it("should reset correctly", () => {
    tracker.addUsage({
      prompt_tokens: 10,
      completion_tokens: 20,
      total_tokens: 30,
    });
    tracker.reset();

    const stats = tracker.getStats();
    expect(stats.total_prompt_tokens).toBe(0);
    expect(stats.total_completion_tokens).toBe(0);
    expect(stats.total_tokens).toBe(0);
    expect(stats.request_count).toBe(0);
  });
});

describe("SOLAR_CHAT_TOOL", () => {
  it("should have correct tool name", () => {
    expect(SOLAR_CHAT_TOOL_NAME).toBe("solar_chat");
  });

  it("should have messages as required field", () => {
    expect(SOLAR_CHAT_INPUT_SCHEMA.required).toContain("messages");
  });

  it("should define all expected properties", () => {
    const props = SOLAR_CHAT_INPUT_SCHEMA.properties;
    expect(props.messages).toBeDefined();
    expect(props.model).toBeDefined();
    expect(props.temperature).toBeDefined();
    expect(props.max_tokens).toBeDefined();
    expect(props.top_p).toBeDefined();
    expect(props.stop).toBeDefined();
    expect(props.stream).toBeDefined();
  });
});
