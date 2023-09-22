import React, { useState } from "react";
import axios from "axios";
const AddMovieForm = ({ movies, setMovies })=> {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [rating, setRating] = useState(1)

    const submit = async(event)=> {
        event.preventDefault()
        const newMovie = {name, description, rating}
        const {data} = await axios.post('/api/movies', newMovie)
        setMovies([...movies, data])
    }

    return (
        <div>
            <form onSubmit={submit}>
                <label>
                    Title:
                    <input type="text" onChange={ev => setName(ev.target.value)}/>
                </label>
                <label>
                    Description:
                    <input type="text" onChange={ev => setDescription(ev.target.value)}/>
                </label>
                <label>
                    Rating:
                    <input type="number" min="1" max="5" onChange={ev => setRating(ev.target.value)}/>
                </label>
                <button type="submit">Create</button>
            </form>
        </div>
    )
}

export default AddMovieForm