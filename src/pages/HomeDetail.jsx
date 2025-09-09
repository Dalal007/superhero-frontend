import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useSelector } from "react-redux";

export default function HeroDetail() {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    api
      .get(`/heroes/${id}`)
      .then((r) => setHero(r.data))
      .catch((e) => setError(e?.response?.data?.message || e?.message || "Failed to load hero."));
  }, [id]);

  useEffect(() => {
    if (!user) {
      setIsFavorite(false);
      return;
    }
    // Check if this hero is in favourites
    api
      .get("/favorites")
      .then((r) => {
        const items = Array.isArray(r.data) ? r.data : [];
        setIsFavorite(items.some((h) => String(h._id) === String(id)));
      })
      .catch(() => setIsFavorite(false));
  }, [user, id]);

  if (!hero) return null;

  const toggleFavorite = async () => {
    if (!user) {
      const redirect = encodeURIComponent(`/hero/${id}`);
      navigate(`/login?redirect=${redirect}&action=addfav&heroId=${id}`);
      return;
    }
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post("/favorites", { heroId: id });
        setIsFavorite(true);
      }
      setError("");
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to update favourites.");
    }
  };

  const save = async (patch) => {
    await api.patch(`/heroes/${id}`, patch);
    const { data } = await api.get(`/heroes/${id}`);
    setHero(data);
  };

  return (
    <article className="grid md:grid-cols-3 gap-6">
      <img src={hero.imageUrl} className="rounded-2xl w-full" />
      <div className="md:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold">{hero.name}</h1>
        {error && (
          <div className="rounded-xl bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-4 py-3">
            {error}
          </div>
        )}
        <div className="card grid sm:grid-cols-2 gap-4">
          {Object.entries(hero.powerstats || {}).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="capitalize">{k}</span>
              <span className="font-semibold">{v}</span>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-semibold mb-2">Biography</h3>
            <dl className="text-sm space-y-1">
              <div>
                <b>Full name:</b> {hero.biography?.fullName}
              </div>
              <div>
                <b>Publisher:</b> {hero.biography?.publisher}
              </div>
              <div>
                <b>Alignment:</b> {hero.biography?.alignment}
              </div>
            </dl>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Appearance</h3>
            <div className="text-sm">
              Gender: {hero.appearance?.gender} | Race: {hero.appearance?.race}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn" onClick={toggleFavorite}>
            {isFavorite ? "⭐ Remove from favourites" : "⭐ Add to favourites"}
          </button>
          {user && (user.role === "editor" || user.role === "admin") && (
            <button
              className="btn"
              onClick={() => {
                const newName = prompt("Rename hero:", hero.name);
                if (newName && newName !== hero.name) save({ name: newName });
              }}
            >
              ✏️ Edit name
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
