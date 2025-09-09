import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerThunk } from "../store/authSlice";

const RegisterSchema = Yup.object({
  email: Yup.string()
    .trim()
    .lowercase()
    .email("Invalid email")
    .max(254, "Email must be at most 254 characters")
    .required("Email is required"),
  name: Yup.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters").required("Name is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .matches(/[a-z]/, "Password must include a lowercase character")
    .matches(/[A-Z]/, "Password must include an uppercase character")
    .matches(/[0-9]/, "Password must include a digit")
    .matches(/[^A-Za-z0-9]/, "Password must include a special character")
    .required("Password is required"),
});

export default function Register() {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        setError("");
        try {
          const res = await dispatch(registerThunk({ name: values.name, email: values.email, password: values.password }));
          if (res.error) throw res.payload || new Error("Registration failed");
          nav("/");
        } catch (e) {
          const msg = e?.message || e?.response?.data?.message || "Registration failed.";
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
          <h1 className="text-xl font-bold">Create account</h1>
          {error && (
            <div className="rounded-xl bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 px-4 py-3">
              {error}
            </div>
          )}
          <Field className="input" name="name" placeholder="Name" />
          <ErrorMessage name="name" component="div" className="text-sm text-red-600" />

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
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
