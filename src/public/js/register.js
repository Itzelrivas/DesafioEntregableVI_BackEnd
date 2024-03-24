const form = document.getElementById('registerForm');

form.addEventListener('submit', e => {
    e.preventDefault();

    const data = new FormData(form)

    const obj = {}
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status === 200) {
            return response.json(); // Parsea la respuesta JSON
        } else if (response.status === 402) {
            return response.json().then(data => {
                Swal.fire({
                    title: 'Error',
                    text: 'El correo proporcionado ya está registrado.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    backdrop: 'rgba(168, 69, 69, 0.666)'
                });
                throw new Error(data.error); 
            });
        } else {
            throw new Error('Error en la solicitud');
        }
    }).then(data => {
        Swal.fire({
            title: `¡Hola, ${data.payload.first_name}!`, 
            text: `Se ha creado un nuevo usuario con el correo: ${data.payload.email} y la contraseña que definiste.`,
            icon: 'success',
            confirmButtonText: 'Aceptar',
            backdrop: 'rgba(82, 69, 168, 0.584)'
        }).then(() => {
            window.location.replace('/users/login');
        });
    }).catch(error => {
        console.error('Ha surgido un error: ', error);
    });
});