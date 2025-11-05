import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import ApiInfo from "./pages/ApiInfo";
import FavoritesList from "./pages/FavoritesList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/favourite" element={<FavoritesList />} />
        <Route path="/apiInfo" element={<ApiInfo />} />
      </Routes>
    </div>
  );
};

export default App;
