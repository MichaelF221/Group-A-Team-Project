export const Contact = () => {
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
              Study Flow Contact
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-none tracking-tight sm:text-5xl">
              Contact <span className="text-primary">Study Flow</span>
              <br />
              and jump into chat.
            </h2>

            <p className="mt-5 max-w-[28ch] text-sm leading-7 text-muted-foreground sm:text-base">
              The live chat room now lives in its own HTML page, but it still sits right
              under this contact section so people can open it here or in a full page.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Chat Room</p>
                <p className="mt-1 text-sm text-muted-foreground">general-room</p>
              </div>

              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Location</p>
                <p className="mt-1 text-sm text-muted-foreground">Standalone `chat.html` page</p>
              </div>

              <div className="rounded-2xl border border-white/6 bg-white/4 px-4 py-4">
                <p className="text-sm font-semibold text-foreground">Chat Server</p>
                <p className="mt-1 text-sm text-muted-foreground">Runs through `npm run dev:chat`</p>
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

          <div className="glass-strong overflow-hidden rounded-[28px] border border-border/60 shadow-2xl">
            <div className="border-b border-white/6 px-6 py-6">
              <h3 className="text-xl font-semibold text-foreground">Live Chat Room</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                This is the standalone `chat.html` page embedded below the contact content.
              </p>
            </div>

            <iframe
              src="/chat.html"
              title="Study Flow chat room"
              className="block h-[780px] w-full border-0 bg-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
