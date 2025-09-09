import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

export default function Nav() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const nav = useNavigate();
  return (
    <header className="border-b sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <div className="container py-3 flex items-center gap-4">
        <Link to="/" className="font-bold text-xl">
          🦸 SuperTeam
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" end className="hover:underline">
            Browse
          </NavLink>
          <NavLink to="/team" className="hover:underline">
            Team Builder
          </NavLink>
          {user && (
            <>
              <NavLink to="/compare" className="hover:underline">
                Compare
              </NavLink>
              <NavLink to="/favorites" className="hover:underline">
                Favourites
              </NavLink>
            </>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {!user ? (
            <>
              <NavLink className="btn" to="/login">
                Login
              </NavLink>
              <NavLink className="btn" to="/register">
                Register
              </NavLink>
            </>
          ) : (
            <>
              <span className="text-sm hidden sm:block">
                Hi, {user.name} ({user.role})
              </span>
              <button
                className="btn"
                onClick={() => {
                  dispatch(logout());
                  nav("/");
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
