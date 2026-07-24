import { useCallback, useState, useEffect } from "react";
import Swal from "sweetalert2";
import video from "./assets/healthy.mp4";
import { Nutrition } from "./NutritionFacts";
import { LoaderPage } from "./LoaderPage";
import "./App.css";

function App() {
  const [mySearch, setMySearch] = useState("");
  const [wordSubmitted, setWordSubmitted] = useState("");
  const [myNutrition, setMyNutrition] = useState([]);
  const [stateLoader, setStateLoader] = useState(false);

  const API_KEY = `OfQhHc2uYKCyCY04q0YqRKGDuY4LTTnHVJraicPC`;
  const API_URL = `https://api.api-ninjas.com/v1/nutrition`;

  const fetchData = useCallback(async () => {
    setStateLoader(true);

    try {
      const response = await fetch(`${API_URL}?query=${wordSubmitted}`, {
        method: "GET",
        headers: {
          "X-Api-Key": API_KEY,
        },
      });

      const data = await response.json();

      if (data.length === 0) {
        Swal.fire({
          title: "Error!",
          text: "Please enter a valid ingredient!",
          icon: "error",
          confirmButtonText: "Try Again",
        });

        setMyNutrition([]);
        setWordSubmitted("");
      } else {
        setMyNutrition(data);
      }
    } catch (error) {
      console.error(error);
    }
    setStateLoader(false);
  }, [wordSubmitted]);

  const myNutritionSearch = (e) => {
    setMySearch(e.target.value);
  };

  const finalSearch = (e) => {
    e.preventDefault();

    if (mySearch.trim() === "") {
      Swal.fire({
        title: "Error!",
        text: "Please enter an ingredient!",
        icon: "error",
        confirmButtonText: "Enter",
      });
      return;
    }

    setWordSubmitted(mySearch);
  };

  useEffect(() => {
    if (wordSubmitted.trim() !== "") {
      fetchData();
    }
  }, [wordSubmitted, fetchData]);

  return (
    <div className="App">
      <div className="container">
        <video autoPlay muted loop playsInline>
          <source src={video} type="video/mp4" />
        </video>

        {stateLoader && <LoaderPage />}

        <h1>Nutrition Analysis</h1>
      </div>

      <div className="container">
        <form onSubmit={finalSearch}>
          <input
            type="text"
            placeholder="Search..."
            value={mySearch}
            onChange={myNutritionSearch}
          />

          <button
            type="submit"
            className={myNutrition.length > 0 ? "button noMargin" : "button"}
          >
            Search
          </button>
        </form>
      </div>

      {myNutrition.length > 0 &&
        Object.entries(myNutrition[0])
          .filter(([key]) => key !== "calories" && key !== "protein_g")
          .map(([key, value]) => (
            <Nutrition key={key} label={key} quantity={value} />
          ))}
    </div>
  );
}

export default App;
