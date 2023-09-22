const pg = require('pg');
const client = new pg.Client('postgres://localhost/movies');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json())

const homePage = path.join(__dirname, 'index.html');
app.get('/', (req, res)=> res.sendFile(homePage));

const reactApp = path.join(__dirname, 'dist/main.js');
app.get('/dist/main.js', (req, res)=> res.sendFile(reactApp));

const reactSourceMap = path.join(__dirname, 'dist/main.js.map');
app.get('/dist/main.js.map', (req, res)=> res.sendFile(reactSourceMap));

const styleSheet = path.join(__dirname, 'styles.css');
app.get('/styles.css', (req, res)=> res.sendFile(styleSheet));

// Routes
app.get('/api/movies', async(req, res, next)=> {
  try {
    const SQL = `
    SELECT *
    FROM movies
    ORDER BY id;
  `
  const response = await client.query(SQL)
  res.send(response.rows)
  } catch (error) {
    next(error)
  }
})

app.put('/api/movies/:id', async(req, res, next)=> {
  try {
    if(req.body.rating < 1 || req.body.rating > 5){
      throw new Error("Invalid Rating")
    }
    const SQL = `
      UPDATE movies
      SET name = $1, description = $2, rating = $3
      WHERE id = $4
      RETURNING *;
    `
    const response = await client.query(SQL, [req.body.name, req.body.description, req.body.rating, req.params.id])
    res.send(response.rows[0])
  } catch (error) {
    next(error)
  }
})

app.delete('/api/movies/:id', async(req, res, next)=> {
  try {
    const SQL = `
      DELETE 
      FROM movies
      WHERE id = $1;
    `
    const response = await client.query(SQL, [req.params.id])
    res.send(response.rows)
  } catch (error) {
    next(error)
  }
})

app.post('/api/movies', async(req, res, next)=> {
  try {
    const SQL = `
      INSERT INTO movies(name, description, rating)
      VALUES($1, $2, $3)
      RETURNING *;
    `
    const response = await client.query(SQL, [req.body.name, req.body.description, req.body.rating])
    res.send(response.rows)
  } catch (error) {
    next(error)
  }
})

app.use((err, req, res, next)=> {
  res.status(500).send(err.message)
})

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  const SQL = `
    DROP TABLE IF EXISTS movies;
    CREATE TABLE movies(
      id SERIAL PRIMARY KEY,
      name VARCHAR(30),
      description VARCHAR(500),
      rating INT
    );
    INSERT INTO movies (name, description, rating) VALUES ('The ShawShank Redemption', 'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.', 5);
    INSERT INTO movies (name, description, rating) VALUES ('The Godfather', 'Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.', 5);
    INSERT INTO movies (name, description, rating) VALUES ('The Dark Knight', 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', 5);
    INSERT INTO movies (name, description, rating) VALUES ('Pupl Fiction', 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 5);
    INSERT INTO movies (name, description, rating) VALUES ('The Good, the Bad and the Ugly', 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.', 5);
  `;
  await client.query(SQL)

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
