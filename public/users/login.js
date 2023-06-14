document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    } else {
        console.error('El formulario de inicio de sesión no se encontró en el documento.');
    }

    function loginUser(event) {
        event.preventDefault();
    
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
    
        const username = usernameInput.value;
        const password = passwordInput.value;
    
        // Realizar la solicitud POST al servidor para iniciar sesión
        fetch('http://192.168.1.6:8000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ocurrió un error al intentar iniciar sesión');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                // Mostrar mensaje de error en caso de credenciales inválidas
                console.error('Error: Usuario o contraseña incorrectos');
                alert('Error: Usuario o contraseña incorrectos');
            } else {
                // Guardar el nombre de usuario en el almacenamiento local
                localStorage.setItem('username', username);
                localStorage.setItem('sessionActive', password);
    
                // Redireccionar al usuario a la página de inicio de sesión exitoso
                window.location.href = '/users/loggedin.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al intentar iniciar sesión');
        });
    }
    
});
