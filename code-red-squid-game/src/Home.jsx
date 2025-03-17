import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../public/Home.css";

const Home = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <div className="home-container">
      <h1 className={`code-red ${fadeOut ? "fade-out" : ""}`}>CODE RED</h1>
      {fadeOut && (
        <div className="buttons-container">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default Home;