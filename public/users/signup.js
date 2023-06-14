document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('signupForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const zipcode = document.getElementById('zipcode').value;
    const phonenum = document.getElementById('phonenum').value;
    const usertype = document.getElementById('usertype').value;
    const review = document.getElementById('review').value;
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const countryCode = document.getElementById('countryCode').value;

    // Validar campos obligatorios
    if (
      !username ||
      !email ||
      !password ||
      !zipcode ||
      !phonenum ||
      !usertype ||
      !review ||
      !firstname ||
      !lastname ||
      !countryCode
    ) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, ingrese un correo electrónico válido.');
      return;
    }

    // Validar formato de número de teléfono
    const phoneRegex = /^\d{7,}$/;
    if (!phoneRegex.test(phonenum)) {
      alert('Por favor, ingrese un número de teléfono válido.');
      return;
    }

    function formatPhoneNumber(phone, countryCode) {
      let formattedPhone = phone;

      if (countryCode === '503') {
        // Formato para El Salvador: 3215-6547
        formattedPhone = phone.substring(0, 4) + '-' + phone.substring(4, 8);
      } else if (countryCode === '1') {
        // Formato para Estados Unidos: (654) 321-4589
        formattedPhone =
          '(' +
          phone.substring(0, 3) +
          ') ' +
          phone.substring(3, 6) +
          '-' +
          phone.substring(6, 10);
      } else if (countryCode === '34') {
        // Formato para España: 911 360 190
        formattedPhone =
          phone.substring(0, 3) +
          ' ' +
          phone.substring(3, 6) +
          ' ' +
          phone.substring(6, 9) +
          ' ' +
          phone.substring(9, 12);
      } else if (countryCode === '52') {
        // Formato para México: xx xxxx-xxxx
        formattedPhone =
          phone.substring(0, 2) +
          ' ' +
          phone.substring(2, 6) +
          '-' +
          phone.substring(6, 10);
      }

      return formattedPhone;
    }

    // Formatear número de teléfono
    const formattedPhone = formatPhoneNumber(phonenum, countryCode);

    // Validar formato de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número, un carácter especial y tener al menos 8 caracteres.'
      );
      return;
    }

    // Crear objeto con los datos del usuario
    const data = {
      username: username,
      email: email,
      password: password,
      zipcode: zipcode,
      phone: formattedPhone,
      usertype: usertype,
      review: review,
      firstname: firstname,
      lastname: lastname,
    };

    // Enviar solicitud al servidor para registrar al usuario
    fetch('http://192.168.1.6:8000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
          throw new Error(
            'Página: Ya existe un usuario con el mismo nombre de usuario, correo electrónico o número de teléfono'
          );
        } else {
          throw new Error('Ocurrió un error al registrar el usuario');
        }
      })
      .then(function (responseData) {
        alert(responseData.message);
        window.location.href = 'login.html';
      })
      .catch(function (error) {
        // Mostrar el mensaje de error en la página
        const errorElement = document.createElement('p');
        errorElement.classList.add('error-message');
        errorElement.textContent = error.message;
        document.getElementById('signupForm').appendChild(errorElement);
      });
  });
});
