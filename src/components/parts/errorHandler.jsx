import React from "react";
import "../css/notFound.css";
import { Link } from "react-router-dom";

export default function ErrorHandler() {
  return (
    <div className="centered-bg">
      <div className="card">
        <div className="mac-header">
          <span className="red"></span>
          <span className="yellow"></span>
          <span className="green"></span>
        </div>
        <span className="card-title">ERROR 404 - PAGE NOT FOUND</span>
        <p className="card-description">
          The requested page does not exist, try to return to the main page or
          use the website navigation.
        </p>
        <span className="card-tag">main.html</span>{" "}
        <div className="code-editor">
          <pre>
            <code>&lt;h1&gt; Somethign went wrong :( &lt;/h1&gt;</code>
          </pre>
        </div>
        <Link to="/" className="card-link animate-pulse">
          Home Page
        </Link>
      </div>
    </div>
  );
}
