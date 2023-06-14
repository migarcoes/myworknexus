// Obtener el nombre de usuario del elemento con el ID 'username'
const usernameElement = document.getElementById('username');
const username = getUsernameFromLocalStorage(); // Obtener el nombre de usuario almacenado en el almacenamiento local

// Actualizar el contenido del elemento 'username' con el nombre de usuario
if (usernameElement) {
    usernameElement.textContent = username;
}

// Obtén la referencia al elemento del enlace "Cerrar sesión"
const logoutLink = document.getElementById('logout-link');

// Agrega el manejador de eventos solo si existe el enlace
if (logoutLink) {
  // Elimina cualquier manejador de eventos previo
  logoutLink.removeEventListener('click', logout);

  // Asigna el manejador de eventos 'logout' al hacer clic en el enlace
  logoutLink.addEventListener('click', logout);
}

// Función para cerrar sesión
function logout() {
    // Eliminar los datos de usuario del almacenamiento local
    localStorage.removeItem('sessionActive'); // Eliminar el indicador de sesión activa

    // Redireccionar al usuario a la página de inicio de sesión
    window.location.href = 'login.html';
}

// Función auxiliar para obtener el nombre de usuario almacenado en el almacenamiento local
function getUsernameFromLocalStorage() {
    return localStorage.getItem('username');
}

