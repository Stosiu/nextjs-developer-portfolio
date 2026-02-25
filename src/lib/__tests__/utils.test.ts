import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("should return a single class string", () => {
    expect(cn("px-2 py-1")).toBe("px-2 py-1")
  })

  it("should merge multiple class strings", () => {
    expect(cn("px-2 py-1", "rounded-lg")).toBe("px-2 py-1 rounded-lg")
  })

  it("should handle three or more class strings", () => {
    expect(cn("bg-white", "text-black", "rounded")).toBe(
      "bg-white text-black rounded"
    )
  })

  it("should ignore falsy conditional classes", () => {
    expect(cn("px-2", false, "py-1")).toBe("px-2 py-1")
  })

  it("should ignore undefined conditional classes", () => {
    expect(cn("px-2", undefined, "py-1")).toBe("px-2 py-1")
  })

  it("should ignore null conditional classes", () => {
    expect(cn("px-2", null, "py-1")).toBe("px-2 py-1")
  })

  it("should ignore empty strings", () => {
    expect(cn("px-2", "", "py-1")).toBe("px-2 py-1")
  })

  it("should resolve tailwind conflicts with last class winning", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
  })

  it("should resolve multiple tailwind conflicts", () => {
    expect(cn("px-2 py-1 bg-white", "px-4 bg-black")).toBe(
      "py-1 px-4 bg-black"
    )
  })

  it("should handle empty inputs", () => {
    expect(cn()).toBe("")
  })

  it("should handle only falsy inputs", () => {
    expect(cn(false, undefined, null, "")).toBe("")
  })

  it("should combine objects and strings", () => {
    expect(
      cn("px-2", { "py-1": true, "rounded": false }, "bg-white")
    ).toBe("px-2 py-1 bg-white")
  })

  it("should handle arrays of classes", () => {
    expect(cn(["px-2", "py-1"], "rounded-lg")).toBe("px-2 py-1 rounded-lg")
  })

  it("should preserve non-conflicting classes", () => {
    expect(cn("px-2 py-1", "rounded-lg text-white")).toBe(
      "px-2 py-1 rounded-lg text-white"
    )
  })

  it("should handle complex tailwind resolution", () => {
    expect(cn("text-sm text-gray-600", "text-base text-blue-500")).toBe(
      "text-base text-blue-500"
    )
  })
})
