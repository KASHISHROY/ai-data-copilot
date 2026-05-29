import { useEffect, useState } from "react";

import { API_BASE_URL, getBackendHealth } from "./api";
import DatasetUpload from "./components/DatasetUpload";

function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadHealth() {
      try {
        const data = await getBackendHealth(controller.signal);
        setHealth(data);
      } catch (caughtError) {
        if (caughtError.name !== "AbortError") {
          setError(caughtError.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadHealth();

    return () => controller.abort();
  }, []);

  const isConnected = health?.status === "ok";

  return (
    <main className="min-h-screen bg-stone-50 text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-7 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-teal-700">
              AI Data Copilot
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
              Workspace
            </h1>
          </div>
          <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
            API: {API_BASE_URL}
          </div>
        </header>

        <section className="grid flex-1 gap-7 py-8 lg:grid-cols-[240px_1fr]">
          <aside className="border-b border-slate-200 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
            <nav className="grid gap-2 text-sm font-medium text-slate-700">
              <span className="rounded-md bg-teal-700 px-3 py-2 text-white">Upload</span>
              <span className="px-3 py-2 text-slate-500">Connection</span>
              <span className="px-3 py-2 text-slate-500">Queries</span>
            </nav>
          </aside>

          <section className="grid content-start gap-6">
            <DatasetUpload />

            <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-normal text-slate-950">
                    Backend Connection
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">Health route</p>
                </div>
                <StatusBadge isConnected={isConnected} isLoading={isLoading} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <StatusField label="Status" value={isLoading ? "Checking" : health?.status ?? "Unavailable"} />
                <StatusField label="Service" value={health?.service ?? "Not connected"} />
                <StatusField label="Environment" value={health?.environment ?? "Unknown"} />
              </div>

              {error ? (
                <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              ) : null}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function StatusBadge({ isConnected, isLoading }) {
  if (isLoading) {
    return (
      <span className="inline-flex w-fit items-center rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
        Checking
      </span>
    );
  }

  return (
    <span
      className={`inline-flex w-fit items-center rounded-md px-3 py-1 text-sm font-semibold ${
        isConnected ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
      }`}
    >
      {isConnected ? "Connected" : "Offline"}
    </span>
  );
}

function StatusField({ label, value }) {
  return (
    <div className="min-h-24 rounded-md border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">{label}</p>
      <p className="mt-3 break-words text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default App;
