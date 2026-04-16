export const Contact = () => {
  return (
    <section id="chatroom" className="relative py-24">
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
        <div className="mx-auto max-w-3xl">
          <aside className="glass rounded-[28px] border border-border/60 p-8 shadow-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_16px_rgba(239,137,60,0.9)]" />
              Study Flow Chatroom
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-none tracking-tight sm:text-5xl">
              Chatroom <span className="text-primary">Study Flow</span>
              <br />
              for live team updates.
            </h2>

            <p className="mt-5 max-w-[28ch] text-sm leading-7 text-muted-foreground sm:text-base">
              Welcome to the StudyFlow chat room. Connect with your peers and StudyFlow
              staff. Private messages coming soon.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Chat Room</p>
                <p className="mt-1 text-sm text-muted-foreground">general-room</p>
              </div>
            </div>

            <a
              href="/chat.html"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-2xl bg-linear-to-br from-primary to-orange-300 px-5 py-3 font-semibold text-primary-foreground shadow-[0_14px_30px_rgba(239,137,60,0.28)] transition hover:-translate-y-0.5"
            >
              Open Chat In Full Page
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
};
