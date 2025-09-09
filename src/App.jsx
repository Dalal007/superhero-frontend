import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Browse from "./pages/Browse";
import HeroDetail from "./pages/HomeDetail";
import TeamBuilder from "./pages/TeamBuilder";
import TeamCompare from "./pages/TeamCompare";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <div className="min-h-dvh bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <Nav />
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<Browse />} />
          <Route path="/hero/:id" element={<HeroDetail />} />
          <Route path="/team" element={<TeamBuilder />} />
          <Route path="/compare" element={<>{/* protected */}{/* if not user, redirect to login */}<TeamCompare /></>} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
