import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Browse() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    load();
  }, [page, q]);

  async function load() {
    const { data } = await api.get("/heroes", {
      params: { q, page, limit: 24 },
    });
    setItems(data.items);
    setTotal(data.total);
  }

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="Search heroes…"
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {items.map((h) => (
          <Link
            key={h._id}
            to={`/hero/${h._id}`}
            className="card hover:shadow-lg transition"
          >
            <img
              src={h.imageUrl}
              alt={h.name}
              className="w-full aspect-[3/4] object-cover rounded-xl"
            />
            <div className="mt-2 font-semibold">{h.name}</div>
            <div className="text-xs opacity-70">{h.biography?.publisher}</div>
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <button
          className="btn"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {page} / {Math.max(1, Math.ceil(total / 24))}
        </span>
        <button
          className="btn"
          disabled={page >= Math.ceil(total / 24)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
