import axios from "axios";
import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import Results from "./components/Results";
import Popup from "./components/Popup";

function App() {
  const [state, setState] = useState({
    searchQuery: "",
    results: [],
    selected: {}
  });

  
  const apiUrl = window.env.JIKAN_API;

  const search = (event) => {
    if (event.key === "Enter") {
      axios(apiUrl + "search/anime?q=" + state.searchQuery).then(({ data }) => {
        
       const jikanResults = data.results
        let results = jikanResults.map(result => {
          return {
            Poster: result.image_url,
            Title: result.title,
            Type: result.type,
            Status: result.status,
            Score: result.score,
            Mal_ID: result.mal_id,

            Genre: result.genre,
            Rated: result.rated,
            Year: result.start_date + " - " + result.end_date
          }
        })

        setState(previousState => {
          return{ ...previousState, results: results }
        })
      });
      
    } 
  }

  const handleInput = (event) => {
    let searchQuery = event.target.value;

    setState(previousState => {
      return {...previousState, searchQuery: searchQuery}
    });
  }

  const openPopup = id => {
    axios(apiUrl + "anime/" + id).then(({ data }) => {
      let result = {
        Poster: data.image_url,
        Title: data.title,
        Type: data.type,
        Status: data.status,
        Score: data.score,
        Mal_ID: data.mal_id,

        Genre: data.genre,
        Rated: data.rated,
        Year: data.start_date + " - " + data.end_date
        
      };

      console.log(result);

      setState(previousState => {
        return { ...previousState, selected: result }
      });
    });
  }

  const closePopup = () => {
    setState(previousState => {
      return { ...previousState, selected: {} }
    });
  }

  return (
    <div className="App">
      <header className="header">
        <h1 className="header__title">Anime Database</h1>
      </header>
      <main className="main">
        <SearchBar handleInput={handleInput} search={search} />
        <Results results={state.results} openPopup={openPopup} />
        {(typeof state.selected.Title != "undefined") ? <Popup selected={state.selected} closePopup={closePopup} /> : false }
      </main>
    </div>
  );
}

export default App;
