import { useEffect, useState } from "react";
import { Mail, User, ShieldCheck, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

function formatJoinedDate(user) {
  if (!user?.createdAt) return "Recently joined";

  const date = new Date(user.createdAt);
  if (Number.isNaN(date.getTime())) return "Recently joined";

  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("studyflow_token");
    const storedUser = localStorage.getItem("studyflow_user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  if (!user) return null;

  const details = [
    {
      label: "Full Name",
      value: user.fullName || "Not set",
      icon: User,
    },
    {
      label: "Email Address",
      value: user.email || "Not set",
      icon: Mail,
    },
    {
      label: "Account Status",
      value: "Logged in",
      icon: ShieldCheck,
    },
    {
      label: "Member Since",
      value: formatJoinedDate(user),
      icon: CalendarDays,
    },
  ];

  return (
    <section className="min-h-screen bg-linear-to-b from-zinc-900 to-zinc-800 px-6 pt-32 pb-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="animate-fade-in">
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-orange-300/80">
            Account Overview
          </p>
          <h1 className="bg-linear-to-r from-orange-400 via-amber-400 to-rose-400 bg-clip-text text-5xl font-bold text-transparent">
            Your StudyFlow Profile
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-300">
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-zinc-700 bg-zinc-800/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Signed In As</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">{user.fullName || "StudyFlow User"}</h2>
                <p className="mt-2 text-zinc-300">{user.email || "No email saved"}</p>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-orange-400/40 bg-linear-to-br from-orange-500/30 to-amber-400/10 text-4xl font-bold text-orange-200">
                {(user.fullName || "S").charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {details.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 rounded-2xl border border-zinc-700 bg-zinc-900/70 px-5 py-4"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-300">
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">{label}</p>
                    <p className="text-base font-medium text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-700 bg-zinc-800/80 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm animate-fade-in">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Quick View</p>
            <div className="mt-6 rounded-3xl border border-orange-500/30 bg-linear-to-br from-orange-500/20 via-zinc-900/70 to-zinc-900/80 p-6">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_18px_rgba(34,197,94,0.9)]" />
                <span className="text-sm font-medium tracking-wide text-zinc-200">Active session</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white"></h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                You now have access to KanBan and the Ai Chatbot!
              </p>
            </div>

            <div className="mt-6 space-y-4 rounded-3xl border border-zinc-700 bg-zinc-900/70 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Primary workspace</span>
                <span className="rounded-full bg-zinc-700 px-3 py-1 text-xs font-medium text-zinc-200">StudyFlow</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Current board access</span>
                <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-medium text-green-300">Kanban enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">Chat tools</span>
                <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-medium text-orange-200">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
