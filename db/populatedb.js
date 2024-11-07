const { Client } = require("pg");

const SQL = `
      DROP TABLE IF EXISTS Games;
      DROP TABLE IF EXISTS Genres;
      DROP TABLE IF EXISTS Developers;

      CREATE TABLE IF NOT EXISTS Genres (
          genre_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          genre_name VARCHAR(50) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Developers (
          developer_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          developer_name VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Games (
          game_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
          game_name VARCHAR(100) NOT NULL,
          genre_id INTEGER REFERENCES Genres(genre_id) ON DELETE SET NULL,
          developer_id INTEGER REFERENCES Developers(developer_id) ON DELETE SET NULL,
          release_date DATE
      );

      INSERT INTO Genres (genre_name) VALUES
          ('Action'),
          ('Adventure'),
          ('Role-Playing'),
          ('Strategy'),
          ('Simulation');

      INSERT INTO Developers (developer_name) VALUES
          ('Epic Games'),
          ('Naughty Dog'),
          ('BioWare'),
          ('Firaxis Games'),
          ('Maxis');

      INSERT INTO Games (game_name, genre_id, developer_id, release_date) VALUES
          ('Fortnite', 1, 1, '2017-07-21'),
          ('Uncharted 4', 1, 2, '2016-05-10'),
          ('Gears of War', 1, 1, '2006-11-07');

      INSERT INTO Games (game_name, genre_id, developer_id, release_date) VALUES
          ('The Last of Us', 2, 2, '2013-06-14'),
          ('Uncharted: Drake''s Fortune', 2, 2, '2007-11-19'),
          ('Unravel', 2, 3, '2016-02-09');

      INSERT INTO Games (game_name, genre_id, developer_id, release_date) VALUES
          ('Mass Effect', 3, 3, '2007-11-20'),
          ('Dragon Age: Origins', 3, 3, '2009-11-03'),
          ('Star Wars: Knights of the Old Republic', 3, 3, '2003-07-16');

      INSERT INTO Games (game_name, genre_id, developer_id, release_date) VALUES
          ('Sid Meier''s Civilization VI', 4, 4, '2016-10-21'),
          ('XCOM 2', 4, 4, '2016-02-05'),
          ('Total War: Rome II', 4, 4, '2013-09-03');

      INSERT INTO Games (game_name, genre_id, developer_id, release_date) VALUES
          ('The Sims 4', 5, 5, '2014-09-02'),
          ('SimCity', 5, 5, '2013-03-05'),
          ('Spore', 5, 5, '2008-09-07');
    `;

async function main() {
  const client = new Client({
    connectionString: process.argv[2],
  });
  try {
    console.log(process.argv[2]);
    await client.connect();
    await client.query(SQL);
  } catch (error) {
    console.error("Error executing query:", error);
  } finally {
    await client.end();
    console.log("done");
  }
}

main();
