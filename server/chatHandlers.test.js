// server/chatHandlers.test.js
import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";
import { registerChatHandlers } from "./chatHandlers.js";

describe("registerChatHandlers", () => {
  let io;
  let socket;
  let Message;
  let handlers;
  let emit;

  beforeEach(() => {
    handlers = {};
    emit = vi.fn();

    io = {
      to: vi.fn(() => ({ emit })),
    };

    socket = {
      id: "socket-123",
      join: vi.fn(),
      on: vi.fn((eventName, handler) => {
        handlers[eventName] = handler;
      }),
    };

    Message = {
      create: vi.fn(),
    };

    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    registerChatHandlers(io, socket, Message);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registers joinConversation handler", () => {
    expect(socket.on).toHaveBeenCalledWith("joinConversation", expect.any(Function));
  });

  it("registers sendMessage handler", () => {
    expect(socket.on).toHaveBeenCalledWith("sendMessage", expect.any(Function));
  });

  it("registers disconnect handler", () => {
    expect(socket.on).toHaveBeenCalledWith("disconnect", expect.any(Function));
  });

  it("joins the requested conversation room", () => {
    handlers.joinConversation("general-room");

    expect(socket.join).toHaveBeenCalledTimes(1);
    expect(socket.join).toHaveBeenCalledWith("general-room");
  });

  it("saves the incoming message data", async () => {
    Message.create.mockResolvedValue({ _id: "msg-1" });

    await handlers.sendMessage({
      conversationId: "general-room",
      sender: "Test",
      text: "Hello world",
    });

    expect(Message.create).toHaveBeenCalledTimes(1);
    expect(Message.create).toHaveBeenCalledWith({
      conversationId: "general-room",
      sender: "Test",
      text: "Hello world",
    });
  });

  it("broadcasts a saved message to the correct room", async () => {
    const savedMessage = {
      _id: "msg-1",
      conversationId: "general-room",
      sender: "Test",
      text: "Hello world",
      createdAt: "2026-04-17T12:00:00.000Z",
    };

    Message.create.mockResolvedValue(savedMessage);

    await handlers.sendMessage({
      conversationId: "general-room",
      sender: "Test",
      text: "Hello world",
    });

    expect(io.to).toHaveBeenCalledTimes(1);
    expect(io.to).toHaveBeenCalledWith("general-room");
    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith("newMessage", savedMessage);
  });

  it("emits the saved database object, not just raw input", async () => {
    const savedMessage = {
      _id: "db-123",
      conversationId: "general-room",
      sender: "Test",
      text: "Hello world",
      createdAt: new Date("2026-04-17T12:00:00.000Z"),
    };

    Message.create.mockResolvedValue(savedMessage);

    await handlers.sendMessage({
      conversationId: "general-room",
      sender: "Test",
      text: "Hello world",
    });

    expect(emit).toHaveBeenCalledWith("newMessage", savedMessage);
  });

  it("catches save failures without throwing", async () => {
    Message.create.mockRejectedValue(new Error("DB failed"));

    await expect(
      handlers.sendMessage({
        conversationId: "general-room",
        sender: "Test",
        text: "Hello world",
      })
    ).resolves.toBeUndefined();
  });

  it("logs an error when saving fails", async () => {
    Message.create.mockRejectedValue(new Error("DB failed"));

    await handlers.sendMessage({
      conversationId: "general-room",
      sender: "Test",
      text: "Hello world",
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith("Error saving message:", "DB failed");
  });

  it("does not broadcast when saving fails", async () => {
    Message.create.mockRejectedValue(new Error("DB failed"));

    await handlers.sendMessage({
      conversationId: "general-room",
      sender: "Test",
      text: "Hello world",
    });

    expect(io.to).not.toHaveBeenCalled();
    expect(emit).not.toHaveBeenCalled();
  });

  it("runs disconnect handler safely", () => {
    expect(() => handlers.disconnect()).not.toThrow();
    expect(console.log).toHaveBeenCalledWith("User disconnected:", "socket-123");
  });
}); 
