import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function TeamBuilder() {
  const [type, setType] = useState("balanced");
  const [stat, setStat] = useState("strength");
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, [type, stat]);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/teams/recommend", {
        params: { type, stat, size: 5, r: Date.now() },
      });
      setTeam(data.team || []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load team.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="card flex flex-wrap gap-3 items-center">
        <select
          className="input max-w-xs"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="balanced">Balanced (good/bad/neutral)</option>
          <option value="power">Power-focused</option>
          <option value="random">Random</option>
        </select>
        {type === "power" && (
          <select
            className="input max-w-xs"
            value={stat}
            onChange={(e) => setStat(e.target.value)}
          >
            {[
              "intelligence",
              "strength",
              "speed",
              "durability",
              "power",
              "combat",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
        <button className="btn" onClick={load} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {team.map((h) => (
          <Link key={h._id} to={`/hero/${h._id}`} className="card hover:shadow-lg transition">
            <img
              src={h.imageUrl}
              className="w-full aspect-[3/4] object-cover rounded-xl"
            />
            <div className="mt-2 font-semibold">{h.name}</div>
            <div className="text-xs opacity-70">
              {h.biography?.alignment || "n/a"}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
