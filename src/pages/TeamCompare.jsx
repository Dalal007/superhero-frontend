import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function TeamCompare() {
  const [qA, setQA] = useState("");
  const [qB, setQB] = useState("");
  const [resA, setResA] = useState([]);
  const [resB, setResB] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const user = useSelector((s) => s.auth.user);
  const ready = useSelector((s) => s.auth.ready);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!qA) {
        setResA([]);
        return;
      }
      setLoadingA(true);
      api
        .get("/heroes", { params: { q: qA, page: 1, limit: 8 } })
        .then((r) => setResA(r.data.items || []))
        .catch(() => setResA([]))
        .finally(() => setLoadingA(false));
    }, 300);
    return () => clearTimeout(t);
  }, [qA]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!qB) {
        setResB([]);
        return;
      }
      setLoadingB(true);
      api
        .get("/heroes", { params: { q: qB, page: 1, limit: 8 } })
        .then((r) => setResB(r.data.items || []))
        .catch(() => setResB([]))
        .finally(() => setLoadingB(false));
    }, 300);
    return () => clearTimeout(t);
  }, [qB]);

  const canCompare = useMemo(() => teamA.length > 0 && teamB.length > 0, [teamA, teamB]);

  const addToTeam = (team, setTeam, hero) => {
    if (team.find((h) => h._id === hero._id)) return;
    setTeam([...team, hero]);
  };

  const removeFromTeam = (team, setTeam, id) => {
    setTeam(team.filter((h) => h._id !== id));
  };

  const compare = async () => {
    if (!ready) return; // wait for auth init
    if (!user) {
      setError("Please login to compare teams.");
      return;
    }
    setComparing(true);
    setError("");
    setResult(null);
    try {
      const { data } = await api.post("/teams/compare", {
        teamA: teamA.map((h) => h._id),
        teamB: teamB.map((h) => h._id),
      });
      setResult(data);
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        setError("Please login to compare teams.");
      } else {
        setError(e?.response?.data?.message || e?.message || "Comparison failed.");
      }
    } finally {
      setComparing(false);
    }
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Team Compare</h1>
      {error && (
        <div className="rounded-xl bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-4 py-3">
          {error} {(!user && ready) && (
            <>
              <span className="mx-1">·</span>
              <Link className="underline" to="/login?redirect=%2Fcompare">Login</Link>
            </>
          )}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="font-semibold">Team A</h2>
          <input
            className="input"
            placeholder="Search heroes for Team A…"
            value={qA}
            onChange={(e) => setQA(e.target.value)}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {loadingA && <div className="opacity-70">Loading…</div>}
            {!loadingA &&
              resA.map((h) => (
                <button
                  key={h._id}
                  className="card text-left"
                  type="button"
                  onClick={() => addToTeam(teamA, setTeamA, h)}
                >
                  <img src={h.imageUrl} className="w-full aspect-[3/4] object-cover rounded-xl" />
                  <div className="mt-2 font-semibold">{h.name}</div>
                </button>
              ))}
          </div>
          {!!teamA.length && (
            <div className="card">
              <h3 className="font-semibold mb-2">Selected</h3>
              <div className="flex flex-wrap gap-2">
                {teamA.map((h) => (
                  <span key={h._id} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                    {h.name}
                    <button
                      type="button"
                      className="text-sm opacity-70 hover:opacity-100"
                      onClick={() => removeFromTeam(teamA, setTeamA, h._id)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Team B</h2>
          <input
            className="input"
            placeholder="Search heroes for Team B…"
            value={qB}
            onChange={(e) => setQB(e.target.value)}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {loadingB && <div className="opacity-70">Loading…</div>}
            {!loadingB &&
              resB.map((h) => (
                <button
                  key={h._id}
                  className="card text-left"
                  type="button"
                  onClick={() => addToTeam(teamB, setTeamB, h)}
                >
                  <img src={h.imageUrl} className="w-full aspect-[3/4] object-cover rounded-xl" />
                  <div className="mt-2 font-semibold">{h.name}</div>
                </button>
              ))}
          </div>
          {!!teamB.length && (
            <div className="card">
              <h3 className="font-semibold mb-2">Selected</h3>
              <div className="flex flex-wrap gap-2">
                {teamB.map((h) => (
                  <span key={h._id} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                    {h.name}
                    <button
                      type="button"
                      className="text-sm opacity-70 hover:opacity-100"
                      onClick={() => removeFromTeam(teamB, setTeamB, h._id)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="btn" disabled={!canCompare || comparing || !ready} onClick={compare}>
          {comparing ? "Comparing…" : "Compare Teams"}
        </button>
      </div>

      {result && (
        <div className="card">
          <h3 className="font-semibold mb-2">Result</h3>
          {result.winner ? (
            <div className="space-y-2">
              <div>
                <b>Winner:</b> {String(result.winner)}
              </div>
              {result.explanation && <div className="text-sm opacity-80">{result.explanation}</div>}
            </div>
          ) : (
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </section>
  );
}


