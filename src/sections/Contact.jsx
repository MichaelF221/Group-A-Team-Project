import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const chatServerUrl = `http://${window.location.hostname}:3000`;
const currentRoom = "general-room";

export const Contact = () => {
  const [messages, setMessages] = useState([
    {
      id: "system-welcome",
      sender: "Study Flow",
      text: "Say hello to make sure the room is live.",
      type: "system",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Connecting to chat server...");
  const [currentUser] = useState(() => `User_${Math.floor(Math.random() * 1000)}`);
  const messagesRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(chatServerUrl);
    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus(`Connected to ${chatServerUrl}`);
      socket.emit("joinConversation", currentRoom);
    });

    socket.on("connect_error", () => {
      setStatus("Chat server unavailable. Run npm run dev:chat.");
    });

    socket.on("newMessage", (message) => {
      setMessages((currentMessages) => {
        const nextMessages =
          currentMessages[0]?.type === "system"
            ? currentMessages.slice(1)
            : currentMessages.slice();

        nextMessages.push({
          id: message._id ?? `${message.sender}-${Date.now()}`,
          sender: message.sender,
          text: message.text,
          type: message.sender === currentUser ? "self" : "message",
        });

        return nextMessages;
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = draft.trim();
    if (!text || !socketRef.current) {
      return;
    }

    socketRef.current.emit("sendMessage", {
      conversationId: currentRoom,
      sender: currentUser,
      text,
    });

    setDraft("");
  };

  return (
    <section id="contact" className="relative py-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div
          className="absolute left-[8%] top-16 h-36 w-36 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(239, 137, 60, 0.22)" }}
        />
        <div
          className="absolute bottom-12 right-[10%] h-40 w-40 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(124, 195, 189, 0.16)" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="glass rounded-[28px] border border-border/60 p-8 shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_16px_rgba(239,137,60,0.9)]" />
              Study Flow Live Chat
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-none tracking-tight sm:text-5xl">
              Study <span className="text-primary">Flow</span>
              <br />
              for real-time team work.
            </h2>

            <p className="mt-5 max-w-[28ch] text-sm leading-7 text-muted-foreground sm:text-base">
              A focused workspace for quick check-ins, planning nudges, and shared
              momentum without leaving the Study Flow experience.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Room</p>
                <p className="mt-1 text-sm text-muted-foreground">{currentRoom}</p>
              </div>

              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Signed In As</p>
                <p className="mt-1 text-sm text-muted-foreground">{currentUser}</p>
              </div>

              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Connection</p>
                <p className="mt-1 text-sm text-muted-foreground">{status}</p>
              </div>
            </div>
          </aside>

          <div className="glass-strong flex min-h-[720px] flex-col overflow-hidden rounded-[28px] border border-border/60 shadow-2xl">
            <header className="flex flex-col gap-4 border-b border-white/6 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src="/images/chatbot.png"
                  alt="Study Flow chat avatar"
                  className="h-14 w-14 rounded-2xl border border-primary/30 object-cover shadow-[0_12px_30px_rgba(239,137,60,0.18)]"
                />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Team Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Shared room for fast updates and study support
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-primary">Status:</span> {status}
              </p>
            </header>

            <div
              ref={messagesRef}
              className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-6"
            >
              {messages.map((message) => {
                if (message.type === "system") {
                  return (
                    <div
                      key={message.id}
                      className="self-center rounded-full border border-dashed border-muted-foreground/30 px-4 py-2 text-center text-sm text-muted-foreground"
                    >
                      {message.text}
                    </div>
                  );
                }

                const isSelf = message.type === "self";

                return (
                  <article
                    key={message.id}
                    className={`max-w-[85%] rounded-3xl border px-4 py-3 shadow-lg sm:max-w-[75%] ${
                      isSelf
                        ? "self-end border-primary/60 bg-linear-to-br from-primary to-orange-300 text-primary-foreground"
                        : "border-white/6 bg-white/4 text-foreground"
                    }`}
                  >
                    <p
                      className={`mb-1 text-[0.72rem] font-bold uppercase tracking-[0.2em] ${
                        isSelf ? "text-primary-foreground/75" : "text-muted-foreground"
                      }`}
                    >
                      {message.sender}
                    </p>
                    <p className="text-sm leading-6 sm:text-[0.95rem]">{message.text}</p>
                  </article>
                );
              })}
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 border-t border-white/6 bg-background/20 px-6 py-5 sm:flex-row"
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Send a study update, question, or quick check-in..."
                className="min-w-0 flex-1 rounded-2xl border border-white/8 bg-white/4 px-4 py-4 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
              />
              <button
                type="submit"
                className="cursor-pointer rounded-2xl bg-linear-to-br from-primary to-orange-300 px-6 py-4 font-semibold text-primary-foreground shadow-[0_14px_30px_rgba(239,137,60,0.28)] transition hover:-translate-y-0.5"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
