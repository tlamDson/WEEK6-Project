import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddBlog from "./components/AddBlog";
import ListBlog from "./components/ListBlog";
import Comment from "./components/Comment";
import "./App.css";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addBlog" element={<AddBlog />} />
        <Route path="/listBlog" element={<ListBlog />} />
        <Route path="/comments" element={<Comment />} />
      </Routes>
    </div>
  );
};

export default App;
