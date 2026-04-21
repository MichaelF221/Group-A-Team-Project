// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import Chatbot from "./Chatbot";

describe("Chatbot API call", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("calls fetch once when a valid message is sent", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ message: { content: "Hello" } }),
    });

    render(<Chatbot />);

    await userEvent.type(screen.getByRole("textbox"), "What is React?");
    await userEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  it("calls fetch with the POST method", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ message: { content: "Hello" } }),
    });

    render(<Chatbot />);

    await userEvent.type(screen.getByRole("textbox"), "What is React?");
    await userEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/chat",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("calls fetch with the correct text and default model in the request body", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ message: { content: "Hello" } }),
    });

    render(<Chatbot />);

    await userEvent.type(screen.getByRole("textbox"), "What is React?");
    await userEvent.click(screen.getByRole("button", { name: /send/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/chat",
        expect.objectContaining({
          body: JSON.stringify({
            model: "llama3.2:latest",
            text: "What is React?",
          }),
        })
      );
    });
  });
});
