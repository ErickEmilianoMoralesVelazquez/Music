// Fetch data from the backend
fetch("http://localhost:3000/songs")
  .then((response) => response.json())
  .then((data) => {
    console.log("Data:", data);
    const tbody = document.getElementById("songs-table-body");
    tbody.innerHTML = ""; // Clear any existing rows

    data.forEach((song, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${song.song_title}</td>
            <td>${song.duration}</td>
            <td>${song.album_title || "N/A"}</td>
            <td>${song.author_name}</td>
            <td>
            <div class="dropdown">
            <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false"><img src="/public/assets/ellipsis-h-solid.svg" alt=""></button>
  <ul class="dropdown-menu">
    <li><button class="dropdown-item" type="button" onclick="deleteSong(${
                  song.song_id
                })">Delete</button></li>
    <li><button class="dropdown-item" type="button" onclick="loadSongData(${
                  song.song_id
                })">Edit</button></li>
  </ul>
</div>
            </td>
        `;

      tbody.appendChild(row);
    });
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Usamos AJAX para cargar autores y álbumes desde el servidor cuando se abre el modal
$("#addSongModal").on("show.bs.modal", function () {
  // Cargar autores
  $.ajax({
    url: "http://localhost:3000/authors", // Endpoint de Express para obtener autores
    method: "GET",
    success: function (data) {
      console.log(data);
      const authors = data; // No es necesario hacer JSON.parse porque Express ya devuelve JSON
      const authorSelect = $("#songArtist");
      authorSelect.empty(); // Limpiar el select
      authors.forEach(function (author) {
        authorSelect.append(
          `<option value="${author.id}">${author.name}</option>`
        );
      });
    },
    error: function (err) {
      console.error("Error al cargar autores:", err);
    },
  });

  // Cargar álbumes
  $.ajax({
    url: "http://localhost:3000/albums", // Endpoint de Express para obtener álbumes
    method: "GET",
    success: function (data) {
      console.log(data);
      const albums = data; // Nuevamente, no es necesario hacer JSON.parse
      const albumSelect = $("#songAlbum");
      albumSelect.empty(); // Limpiar el select
      albums.forEach(function (album) {
        albumSelect.append(
          `<option value="${album.id}">${album.album_title}</option>`
        );
      });
    },
    error: function (err) {
      console.error("Error al cargar álbumes:", err);
    },
  });
});

// Cuando el botón de guardar canción es presionado
$("#saveSongBtn").on("click", function () {
  const songData = {
    title: $("#songTitle").val().trim(), // .trim() para evitar espacios extra
    author_id: $("#songArtist").val(),
    album_id: $("#songAlbum").val(),
    duration: "3:30", // Ejemplo de duración fija
  };
  
  console.log('id album', songData.album_id); // Verifica si el id está correcto
  
  // Verificar si el título está vacío
  if (!songData.title) {
    alert("Por favor, ingrese el título de la canción.");
    return;
  }

  if (!songData.album_id) {
    alert("Por favor, seleccione un álbum.");
    return;
  }

  if (!songData.author_id) {
    alert("Por favor, seleccione un autor.");
    return;
  }

  // Realizar la solicitud AJAX para agregar la canción
  $.ajax({
    url: "http://localhost:3000/songs",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(songData), // Convertir a JSON


    success: function (response) {
      console.log("Canción agregada con éxito:", response);
      // Aquí puedes agregar lógica para cerrar el modal o actualizar la lista
      location.reload();
    },
    error: function (xhr, status, error) {
      console.error("Error al agregar canción:", error);
      console.log(songData);
      alert("Error al agregar la canción.");
    },
  });
});


function deleteSong(songId) {
  if (!confirm("¿Estás seguro de que deseas eliminar esta canción?")) {
    return;
  }

  $.ajax({
    url: `http://localhost:3000/songs/${songId}`,
    method: "DELETE",
    success: function (response) {
      console.log("Canción eliminada con éxito:", response);
      // Aquí puedes agregar lógica para actualizar la lista
      // Cargar pagina
      location.reload();
    },
    error: function (xhr, status, error) {
      console.error("Error al eliminar la canción:", error);
      alert("Error al eliminar la canción.");
    },
  });
}

// Cargar autores y álbumes en los select (esto es estático para el ejemplo)
// Función para cargar autores y álbumes dinámicamente
function loadAuthorsAndAlbums() {
    return new Promise((resolve, reject) => {
      // Cargar autores
      const authorPromise = fetch("http://localhost:3000/authors")
        .then((response) => response.json())
        .then((authors) => {
          const artistSelect = document.getElementById("updateSongArtist");
          artistSelect.innerHTML = ""; // Limpiar opciones existentes
          authors.forEach((author) => {
            const option = document.createElement("option");
            option.value = author.id;
            option.textContent = author.name;
            artistSelect.appendChild(option);
          });
        });
  
      // Cargar álbumes
      const albumPromise = fetch("http://localhost:3000/albums")
        .then((response) => response.json())
        .then((albums) => {
          const albumSelect = document.getElementById("updateSongAlbum");
          albumSelect.innerHTML = ""; // Limpiar opciones existentes
          albums.forEach((album) => {
            const option = document.createElement("option");
            option.value = album.id;
            option.textContent = album.title;
            albumSelect.appendChild(option);
          });
        });
  
      // Resolver ambas promesas
      Promise.all([authorPromise, albumPromise])
        .then(() => resolve())
        .catch((err) => {
          console.error("Error al cargar autores y álbumes:", err);
          reject(err);
        });
    });
  }
  
  // Función para abrir el modal y cargar datos de la canción
  function loadSongData(songId) {
    // Buscar la canción desde el backend
    fetch(`http://localhost:3000/songs/${songId}`)
      .then((response) => response.json())
      .then((song) => {
        if (song) {
          // Llenar los campos del formulario con los datos de la canción
          document.getElementById("updateSongTitle").value = song.song_title || "";
          return loadAuthorsAndAlbums().then(() => {
            document.getElementById("updateSongArtist").value = song.author_id || "";
            document.getElementById("updateSongAlbum").value = song.album_id || "";
  
            // Guardar el ID de la canción en el botón de guardar
            document
              .getElementById("updateSongBtn")
              .setAttribute("data-song-id", songId);
  
            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById("updateSongModal"));
            modal.show();
          });
        } else {
          alert("La canción no existe.");
          console.error("Canción no encontrada.");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los datos de la canción:", error);
        alert("Error al cargar los datos de la canción.");
      });
  }
  
  // Lógica para guardar cambios al hacer clic en "Actualizar Canción"
  document.getElementById("updateSongBtn").addEventListener("click", function () {
    const songId = this.getAttribute("data-song-id");
    if (!songId) {
      alert("No se pudo identificar la canción a editar.");
      return;
    }
  
    const updatedSong = {
      song_title: document.getElementById("updateSongTitle").value.trim(),
      author_id: document.getElementById("updateSongArtist").value,
      album_id: document.getElementById("updateSongAlbum").value,
    };
  
    // Validar datos antes de enviarlos
    if (!updatedSong.song_title) {
      alert("El título de la canción no puede estar vacío.");
      return;
    }
  
    // Enviar datos al backend
    fetch(`http://localhost:3000/songs/${songId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedSong),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error al actualizar la canción.");
        return response.json();
      })
      .then((data) => {
        console.log("Canción actualizada con éxito:", data);
        alert("Canción actualizada correctamente.");
        location.reload(); // Recargar la página para reflejar los cambios
      })
      .catch((error) => {
        console.error("Error al actualizar la canción:", error);
        alert("No se pudo actualizar la canción.");
      });
  });
  
  // Al cargar la página, inicializar datos
  document.addEventListener("DOMContentLoaded", function () {
    loadAuthorsAndAlbums(); // Precargar autores y álbumes para el modal de agregar
  });
  

  // Suponiendo que la función que maneja los álbumes es algo como esto:

  fetch('http://localhost:3000/albums')
  .then((response) => response.json())
  .then((data) => {
    console.log('albums',data);
    const container = document.getElementById('album-container');
    container.innerHTML = ''; // Limpiar cualquier contenido existente
    // const img_hero = document.getElementById('album-image');
    ;
    // img_hero.src = data[0].img_url;
    // Asignar la imagen al fondo del contenedor
    // albumContainer.style.backgroundImage = `url('${data[0].img_url}')`;



    data.forEach((album) => {
      const div = document.createElement('div');

      div.innerHTML = `
        <div class="card bg-transparent border-0" style="width: 18rem; margin: auto;">
          <img src="${album.img_url}" class="card-img-top rounded-3 albumss" alt="${album.album_title}">
          <div class="card-body ps-0 text-start text-white">
            <p class="card-text fs-5">${album.album_title}</p>
            <p class="card-text fs-6 text">${album.author_name}</p>
          </div>
        </div>
      `;
      container.appendChild(div);
    });
  })
  .catch((error) => {
    console.error('Error al obtener los álbumes:', error);
  });


  fetch('http://localhost:3000/albums')
  .then((response) => response.json())
  .then((data) => {
    // Verificar si se obtuvieron álbumes
    if (data.length > 0) {
      const albumContainer = document.getElementById('album-image');
      const albumAuthor = document.getElementById('album-author');
      const albumTitle = document.getElementById('album-title');

      
      // Elegir un índice aleatorio
      const randomIndex = Math.floor(Math.random() * data.length);
      
      // Usar la URL de la imagen del álbum en el índice aleatorio
      albumContainer.style.backgroundImage = `url('${data[randomIndex].img_url}')`;
      albumAuthor.textContent = data[randomIndex].author_name;
      albumTitle.textContent = data[randomIndex].album_title;
    } else {
      console.error('No se encontraron álbumes.');
    }
  })
  .catch((error) => {
    console.error('Error al obtener los álbumes:', error);
  });


