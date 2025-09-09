import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store";
import { loadMe } from "./store/authSlice";

function Boot() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadMe());
  }, [dispatch]);
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Boot />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
