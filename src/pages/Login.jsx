import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginThunk } from "../store/authSlice";

const LoginSchema = Yup.object({
  email: Yup.string().trim().lowercase().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .matches(/[a-z]/, "Password must include a lowercase character")
    .matches(/[A-Z]/, "Password must include an uppercase character")
    .matches(/[0-9]/, "Password must include a digit")
    .matches(/[^A-Za-z0-9]/, "Password must include a special character")
    .required("Password is required"),
});

export default function Login() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [sp] = useSearchParams();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik
      initialValues={{ email: "editor@example.com", password: "editor123" }}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        setError("");
        try {
          const res = await dispatch(loginThunk({ email: values.email, password: values.password }));
          if (res.error) throw res.payload || new Error("Login failed");
          const action = sp.get("action");
          const heroId = sp.get("heroId");
          const redirect = sp.get("redirect") || "/";
          try {
            if (action === "addfav" && heroId) {
              const { default: api } = await import("../api");
              await api.post("/favorites", { heroId });
            }
          } finally {
            nav(redirect);
          }
        } catch (e) {
          const msg = e?.message || e?.response?.data?.message || "Login failed.";
          const errors = e?.errors || e?.response?.data?.errors;
          if (Array.isArray(errors)) {
            for (const fe of errors) {
              if (fe.field && fe.message) setFieldError(fe.field, fe.message);
            }
          }
          setError(msg);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="card max-w-md mx-auto space-y-3">
          <h1 className="text-xl font-bold">Login</h1>
          {error && (
            <div className="rounded-xl bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-4 py-3">
              {error}
            </div>
          )}
          <Field className="input" name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" className="text-sm text-red-600" />

          <div className="relative">
            <Field
              className="input pr-10"
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm opacity-70 hover:opacity-100"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <ErrorMessage name="password" component="div" className="text-sm text-red-600" />

          <button className="btn w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
