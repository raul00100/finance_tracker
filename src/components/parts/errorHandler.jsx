import React from "react";
import { Link } from "react-router-dom";
import goofyImage from "../images/goofy.jpg"; // Import the image

export default function ErrorHandler() {
  return (
    <div>
      <h1>ERROR 404 - Are you dumb? ✅</h1>
      <h2>There is no such page...🤡</h2>
      <h2>
        This is how you mf felt yourself after done some stupid shi to get on
        this page:{" "}
      </h2>
      <img src={goofyImage} alt="" style={{ marginLeft: "250px" }} />
      <h2>I bet you wanna go back (you have no other choice bruh...)😈</h2>
      <Link to="/">
        <h2> Hoe Page </h2>
      </Link>
    </div>
  );
}
