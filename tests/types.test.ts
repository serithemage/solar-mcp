import { describe, it, expect } from "vitest";
import {
  SOLAR_MODELS,
  DEFAULT_MODEL,
  API_BASE_URL,
} from "../src/common/types.js";

describe("types", () => {
  describe("SOLAR_MODELS", () => {
    it("should contain solar-pro2 model", () => {
      const pro2 = SOLAR_MODELS.find((m) => m.id === "solar-pro2");
      expect(pro2).toBeDefined();
      expect(pro2?.name).toBe("Solar Pro2");
    });

    it("should contain solar-mini model", () => {
      const mini = SOLAR_MODELS.find((m) => m.id === "solar-mini");
      expect(mini).toBeDefined();
      expect(mini?.name).toBe("Solar Mini");
    });
  });

  describe("DEFAULT_MODEL", () => {
    it("should be solar-pro2", () => {
      expect(DEFAULT_MODEL).toBe("solar-pro2");
    });
  });

  describe("API_BASE_URL", () => {
    it("should be the Upstage API URL", () => {
      expect(API_BASE_URL).toBe("https://api.upstage.ai/v1");
    });
  });
});
