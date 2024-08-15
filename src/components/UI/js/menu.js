document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData && userData.role && userData.role !== 'Usuario') {
        document.getElementById('btn-usuarios').style.display = 'block'; // Mostrar el botón solo si el rol no es 'Usuario'
    } else {
        document.getElementById('btn-usuarios').style.display = 'none'; // Ocultar el botón si el rol es 'Usuario'
    }
});

document.getElementById('btn-usuarios').addEventListener('click', function() {
    window.location.href = 'users.html'; // Redirige a users.html
});

document.getElementById('btn-control').addEventListener('click', function() {
    displayContent('control-content');
});

document.getElementById('btn-cerrar-sesion').addEventListener('click', function() {
    cerrarSesion();
});

function displayContent(contentId) {
    const contents = ['usuarios-content', 'control-content'];
    contents.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    document.getElementById(contentId).style.display = 'block';
}

function cerrarSesion() {
    localStorage.removeItem('userData'); // Limpiar datos de usuario al cerrar sesión
    window.location.href = 'index.html'; // Redirigir al login
}
