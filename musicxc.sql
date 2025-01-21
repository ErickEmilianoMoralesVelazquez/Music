-- Crear la base de datos y seleccionarla
DROP DATABASE IF EXISTS music;
CREATE DATABASE music;
USE music;


-- Crear la tabla Authors primero (ya que Songs depende de ella)
CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Crear la tabla Albums (ya que Songs depende de ella)
CREATE TABLE albums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_date DATE,
    img_url VARCHAR(512),
    author_id INT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id)
);


-- Crear la tabla Songs (depende de Authors y Albums)
CREATE TABLE songs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration TIME NOT NULL,
    author_id INT NOT NULL,
    album_id INT DEFAULT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id),
    FOREIGN KEY (album_id) REFERENCES albums(id)
);

-- Crear la tabla Playlists
CREATE TABLE playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla Playlists_Songs (depende de Playlists y Songs)
CREATE TABLE playlists_songs (
    playlist_id INT NOT NULL,
    song_id INT NOT NULL,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id),
    FOREIGN KEY (song_id) REFERENCES songs(id)
);

-- Crear índices
CREATE INDEX idx_author_id ON songs(author_id);
CREATE INDEX idx_album_id ON songs(album_id);
CREATE INDEX idx_title ON songs(title);

CREATE INDEX idx_name ON authors(name);

CREATE INDEX idx_title ON albums(title);
CREATE INDEX idx_release_date ON albums(release_date);

CREATE INDEX idx_name ON playlists(name);

CREATE INDEX idx_playlist_song ON playlists_songs(playlist_id, song_id);
CREATE INDEX idx_song_id ON playlists_songs(song_id);

-- Insertar datos en Authors
INSERT INTO authors (name, description) VALUES
('TheWeeknd', 'Singer-songwriter from the USA'),
('Bad Bunny', 'Boricua singer and songwriter');



-- Insertar datos en Albums
INSERT INTO albums (title, release_date, author_id) VALUES
('Dawn-FM', '2022-01-07', 1),
('DeBÍ TiRAR MáS FOToS', '2025-01-05', 2);

-- Insertar datos en Songs
INSERT INTO songs (title, duration, author_id, album_id) VALUES
('Take my Breath', '00:03:51', 1, 1),
('DtMF', '00:04:24', 2, 2);

SELECT * FROM authors;

INSERT INTO authors (name, description) VALUES('Billie Eilish', 'Blonde singer-songwriter from the USA');
INSERT INTO albums (title, release_date, author_id) VALUES('Happier Than Ever', '2024-05-17', 3);
INSERT INTO albums (title, release_date, author_id) VALUES('Hit Me Hard and Soft', '2021-07-30', 3);

INSERT INTO songs (title, duration, author_id, album_id) VALUES('Happier Than Ever', '00:04:58', 3, 3);
INSERT INTO songs (title, duration, author_id, album_id) VALUES('Wildflower', '00:04:21', 3, 3);



SELECT * FROM authors;
SELECT * FROM albums;  
SELECT * FROM songs;


CREATE PROCEDURE get_songs()
begin
SELECT 
    s.title AS song_title,
    s.duration AS song_duration,
    a.name AS author_name,
    al.title AS album_title
 FROM
    songs s
    JOIN authors a ON s.author_id = a.id
    JOIN albums al ON s.album_id = al.id;
end;

CREATE PROCEDURE new_author(IN author_name VARCHAR(255), IN author_description TEXT)
begin
INSERT INTO authors (name, description) VALUES (author_name, author_description);
end;

CREATE Procedure new_album(IN album_title VARCHAR(255), IN album_release_date DATE, IN author_id INT)
begin
INSERT INTO albums (title, release_date, author_id) VALUES (album_title, album_release_date, author_id);
end;

CREATE PROCEDURE new_song(IN song_title VARCHAR(255), IN song_duration TIME, IN author_id INT, IN album_id INT)
begin
INSERT INTO songs (title, duration, author_id, album_id) VALUES (song_title, song_duration, author_id, album_id);
end;


CALL new_author('Doja Cat', 'She represents a unique way of fusing pop and rap.');
CALL new_album('Planet Her', '2021-06-25', 4);
CALL new_song('Agora Hills', '00:03:06', 4, 4);

CALL get_songs();

SELECT * FROM albums;

-- insertar imagen en album
UPDATE albums SET img_url = 'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2f/22/a9/2f22a9a6-5af1-5846-a44e-ba016724ed69/21UM1IM58860.rgb.jpg/1200x1200bf-60.jpg' WHERE id = 1;
UPDATE albums SET img_url = 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/90/5e/7e/905e7ed5-a8fa-a8f3-cd06-0028fdf3afaa/199066342442.jpg/1200x1200bb.jpg' WHERE id = 2;
UPDATE albums SET img_url = 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2d/f3/c9/2df3c9fd-e0eb-257c-c035-b04f05a66580/21UMGIM36691.rgb.jpg/1200x1200bf-60.jpg' WHERE id = 3;
UPDATE albums SET img_url = 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/1200x1200bb.jpg' WHERE id = 4;
UPDATE albums SET img_url = 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/8b/02/52/8b02528c-8282-6709-dbb3-953da86c6e37/196871470124.jpg/1200x1200bb.jpg' WHERE id = 5;
UPDATE albums SET img_url = 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/14/f3/28/14f32832-b9d9-1ba1-e20a-18c2ff8b6a80/886449410873.jpg/1200x1200bb.jpg' WHERE id = 6;

SELECT 
      albums.id AS album_id, 
      albums.title AS album_title, 
      albums.img_url, 
      authors.name AS author_name
    FROM albums
    LEFT JOIN authors ON albums.author_id = authors.id;

    SELECT * FROM albums;
    SELECT * FROM authors;

    update albums SET author_id = 4 WHERE id = 6;

    ALTER TABLE albums ADD COLUMN author_id INT DEFAULT NULL;
    ALTER TABLE albums ADD CONSTRAINT fk_author_id FOREIGN KEY (author_id) REFERENCES authors(id);


SELECT * FROM albums;

SELECT * FROM songs