import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useSelector } from "react-redux";
import HeroEditForm from "../components/HeroEditForm";

export default function HeroDetail() {
  const { id } = useParams();
  const [hero, setHero] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    api
      .get(`/heroes/${id}`)
      .then((r) => setHero(r.data))
      .catch((e) => {
        if (e?.response?.status === 404) {
          navigate("/404");
        } else {
          setError(e?.response?.data?.message || e?.message || "Failed to load hero.");
        }
      });
  }, [id, navigate]);

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
    try {
      setLoading(true);
      setError("");
      console.log("Saving hero data:", patch);
      
      const response = await api.patch(`/heroes/${id}`, patch);
      console.log("Update response:", response.data);
      
      // Fetch updated hero data
      const { data } = await api.get(`/heroes/${id}`);
      console.log("Updated hero data:", data);
      setHero(data);
    } catch (e) {
      console.error("Error saving hero:", e);
      if (e?.response?.status === 404) {
        navigate("/404");
      } else {
        setError(e?.response?.data?.message || e?.message || "Failed to update hero.");
      }
    } finally {
      setLoading(false);
    }
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
                <b>Full name:</b> {hero.biography?.fullName || "Unknown"}
              </div>
              <div>
                <b>Publisher:</b> {hero.biography?.publisher || "Unknown"}
              </div>
              <div>
                <b>Alignment:</b> {hero.biography?.alignment || "Unknown"}
              </div>
              <div>
                <b>Place of Birth:</b> {hero.biography?.placeOfBirth || "Unknown"}
              </div>
              <div>
                <b>First Appearance:</b> {hero.biography?.firstAppearance || "Unknown"}
              </div>
              {hero.biography?.alterEgos && (
                <div>
                  <b>Alter Egos:</b> {hero.biography.alterEgos}
                </div>
              )}
              {hero.biography?.aliases && hero.biography.aliases.length > 0 && (
                <div>
                  <b>Aliases:</b> {hero.biography.aliases.join(", ")}
                </div>
              )}
            </dl>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Appearance</h3>
            <dl className="text-sm space-y-1">
              <div>
                <b>Gender:</b> {hero.appearance?.gender || "Unknown"}
              </div>
              <div>
                <b>Race:</b> {hero.appearance?.race || "Unknown"}
              </div>
              <div>
                <b>Eye Color:</b> {hero.appearance?.eyeColor || "Unknown"}
              </div>
              <div>
                <b>Hair Color:</b> {hero.appearance?.hairColor || "Unknown"}
              </div>
              {hero.appearance?.height && hero.appearance.height.length > 0 && (
                <div>
                  <b>Height:</b> {hero.appearance.height.join(", ")}
                </div>
              )}
              {hero.appearance?.weight && hero.appearance.weight.length > 0 && (
                <div>
                  <b>Weight:</b> {hero.appearance.weight.join(", ")}
                </div>
              )}
            </dl>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="font-semibold mb-2">Work</h3>
            <dl className="text-sm space-y-1">
              <div>
                <b>Occupation:</b> {hero.work?.occupation || "Unknown"}
              </div>
              <div>
                <b>Base:</b> {hero.work?.base || "Unknown"}
              </div>
            </dl>
          </div>
          <div className="card">
            <h3 className="font-semibold mb-2">Connections</h3>
            <dl className="text-sm space-y-1">
              <div>
                <b>Group Affiliation:</b> {hero.connections?.groupAffiliation || "Unknown"}
              </div>
              <div>
                <b>Relatives:</b> {hero.connections?.relatives || "Unknown"}
              </div>
            </dl>
          </div>
        </div>

        {/* Last Updated Information */}
        {hero.lastUpdatedBy && (
          <div className="card bg-blue-50 dark:bg-blue-900/20">
            <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">Last Updated</h3>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <div><b>By:</b> {hero.lastUpdatedBy.name} ({hero.lastUpdatedBy.email})</div>
              <div><b>At:</b> {new Date(hero.lastUpdatedAt).toLocaleString()}</div>
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button className="btn" onClick={toggleFavorite}>
            {isFavorite ? "⭐ Remove from favourites" : "⭐ Add to favourites"}
          </button>
          {user && (user.role === "editor" || user.role === "admin") && (
            <HeroEditForm
              hero={hero}
              onSave={save}
              onCancel={() => setIsEditing(false)}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
            />
          )}
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Saving changes...</p>
          </div>
        )}
      </div>
    </article>
  );
}
