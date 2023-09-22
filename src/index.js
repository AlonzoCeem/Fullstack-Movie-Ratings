import React from 'react';
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import AddMovieForm from './AddMovieForm';

const App = ()=> {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(()=> {
    const getMovies = async ()=> {
      const { data } = await axios.get('/api/movies');
      setMovies(data);
    }
    getMovies();
  }, []);

  const increaseRating = async(movie)=> {
    try {
      setError("")
      const newRating = movie.rating + 1
      const { data } = await axios.put(`/api/movies/${movie.id}`, {name: movie.name, description: movie.description, rating: newRating})
      const newMovies = movies.map((movieMap)=> {
        if(movieMap.id === movie.id){
          return data
        } else{
          return movieMap
        }
      })
      setMovies(newMovies)
    } catch (error) {
      setError(error.resonse.data)
    }
  }

  const decreaseRating = async(movie)=> {
    try {
      setError("")
      const newRating = movie.rating - 1
      const { data } = await axios.put(`/api/movies/${movie.id}`, {name: movie.name, description: movie.description, rating: newRating})
      const newMovies = movies.map((movieMap)=> {
        if(movieMap.id === movie.id){
          return data
        } else{
          return movieMap
        }
      })
      setMovies(newMovies)
    } catch (error) {
      setError(error.resonse.data)
    }
  }

  const deleteMovie = async(movie)=> {
    await axios.delete(`/api/movies/${movie.id}`)
    const newMovies = movies.filter( movieFilt => movieFilt.id !== movie.id)
    console.log(newMovies)
    setMovies(newMovies)
  }

  return (
    <div>
      <h1>FullStack Template({movies.length})</h1>
      <p>{error ? error : ""}</p>
      <AddMovieForm movies={movies} setMovies={setMovies}/>
      <ul>
        {
          movies.map((movie)=>{
            return (
              <li key={movie.id}>
                <h3>{movie.name}</h3>
                <h4>
                  <span>
                    Rating: {movie.rating} Stars
                    <button onClick={()=> {decreaseRating(movie)}}>-</button>
                    <button onClick={()=> {increaseRating(movie)}}>+</button>
                  </span>
                </h4>
                <p>{movie.description}</p>
                <button onClick={()=> {deleteMovie(movie)}}>Delete</button>
              </li>
            )
          })
        }
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
