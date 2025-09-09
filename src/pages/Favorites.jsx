import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Favorites() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/favorites")
      .then((r) => {
        setItems(r.data);
        setError("");
      })
      .catch((e) => {
        setError(e?.response?.data?.message || e?.message || "Failed to load favourites.");
      });
  }, []);
  if (!items.length) return <p className="opacity-70">No favourites yet.</p>;
  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-4 py-3">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {items.map((h) => (
          <Link key={h._id} to={`/hero/${h._id}`} className="card hover:shadow-lg transition">
            <img
              src={h.imageUrl}
              className="w-full aspect-[3/4] object-cover rounded-xl"
            />
            <div className="mt-2 font-semibold">{h.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
