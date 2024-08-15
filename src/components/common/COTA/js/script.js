document.addEventListener('DOMContentLoaded', function () {
    const selectPersonas = document.getElementById('option1');
    const inputParadas = document.getElementById('input2');
    const inputRecorrido = document.getElementById('input3');
    const resultado = document.getElementById('resultado');
    const input4 = document.getElementById('input4');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');

    const showTableButton = document.getElementById('show-table-button');
    const acabadoPuertaCabinaButton = document.getElementById('acabado-puerta-cabina-button');

    let valorGuardado = '';

        if (showTableButton) {
        showTableButton.addEventListener('click', function () {
            var rightPanel = document.getElementById('right-panel');
            var infoTable = document.getElementById('info-table');

            if (infoTable && rightPanel) {
                if (infoTable.style.display === 'none') {
                    infoTable.style.display = 'table';
                    rightPanel.style.display = 'block';
                } else {
                    infoTable.style.display = 'none';
                    rightPanel.style.display = 'none';
                }
            }
        });
    }

    if (acabadoPuertaCabinaButton) {
        acabadoPuertaCabinaButton.addEventListener('click', function () {
            var rightPanel = document.getElementById('acabado-puerta-cabina-panel');
            var infoTable = document.getElementById('acabado-puerta-cabina-table');

            if (infoTable && rightPanel) {
                if (infoTable.style.display === 'none') {
                    infoTable.style.display = 'table';
                    rightPanel.style.display = 'block';
                } else {
                    infoTable.style.display = 'none';
                    rightPanel.style.display = 'none';
                }
            }
        });
    }

    // Verifica si los elementos existen antes de añadir event listeners
    if (selectPersonas) { selectPersonas.addEventListener('change', actualizarSuma); }

    if (inputParadas) { inputParadas.addEventListener('input', actualizarRecorrido); }

    if (inputRecorrido) {
        inputRecorrido.addEventListener('input', function () {
            inputRecorrido.setAttribute('data-modificado', 'true');
            actualizarSuma();
        });
    }

    if (input4) {
        input4.addEventListener('input', function (event) {
            valorGuardado = event.target.value;
            console.log('Valor guardado:', valorGuardado);
        });
    }


    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            var topNav = document.querySelector('.top-nav');
            if (topNav) {
                topNav.classList.toggle('open');
            }
        });
    }

    // Función para actualizar el valor de Recorrido basado en Paradas
    function actualizarRecorrido() {
        const paradasValue = parseFloat(inputParadas.value);
        if (!isNaN(paradasValue)) {
            const recorridoValue = paradasValue * 3.6;
            if (!inputRecorrido.hasAttribute('data-modificado')) {
                inputRecorrido.value = recorridoValue.toFixed(2);
            }
        }
    }

});

// Función para abrir y cerrar el menú lateral en dispositivos móviles
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Función para cerrar sesión (placeholder)
function logout() {
    alert('Cerrar sesión');
}


/* */

// Variables globales para almacenar los últimos valores guardados
let lastSavedNombre = '';
let lastSavedValor = '';
let lastSavedDescripcion = '';

// Función para imprimir los últimos valores guardados
function rey() {
    console.log('Últimos valores guardados:');
    console.log('Nombre:', lastSavedNombre);
    console.log('Valor:', lastSavedValor);
    console.log('Descripción:', lastSavedDescripcion);
}

document.addEventListener('DOMContentLoaded', function () {
    const initialData = [
        { id: 1, nombre: 'No requiere!', valor: '0', descripcion: 'S/O' },
        { id: 2, nombre: '4 a 8 personas', valor: '450', descripcion: 'Hasta 11 kw' },
        { id: 3, nombre: '10 a 20 personas', valor: '650', descripcion: 'Solo hasta 20 Kw' }
    ];

    // Recuperar datos del localStorage o usar los datos iniciales si no existen
    const data = loadTableDataFromStorage() || initialData;

    const infoTable = document.getElementById('info-table').getElementsByTagName('tbody')[0];
    const editModal = document.getElementById('edit-modal');
    const saveEditButton = document.getElementById('save-edit');
    const cancelEditButton = document.getElementById('cancel-edit');
    const closeModalButton = document.querySelector('.close');

    let currentRow;

    // Cargar datos en la tabla
    function loadTableData() {
        // Limpiar las filas existentes
        infoTable.innerHTML = '';
        data.forEach(item => {
            const row = infoTable.insertRow();
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nombre}</td>
                <td>${item.valor}</td>
                <td>${item.descripcion}</td>
                <td><button class="edit-button">Editar</button></td>
            `;
        });
    }

    // Función para cargar datos desde localStorage
    function loadTableDataFromStorage() {
        return JSON.parse(localStorage.getItem('tableData'));
    }

    // Función para guardar datos en el localStorage
    function updateLocalStorage(data) {
        localStorage.setItem('tableData', JSON.stringify(data));
    }

    // Mostrar modal de edición
    function showEditModal(row) {
        currentRow = row;
        const cells = row.children;

        // Rellenar el formulario con los datos actuales
        document.getElementById('edit-id').value = cells[0].innerText;
        document.getElementById('edit-nombre').value = cells[1].innerText;
        document.getElementById('edit-valor').value = cells[2].innerText;
        document.getElementById('edit-descripcion').value = cells[3].innerText;

        // Mostrar el modal
        editModal.style.display = 'block';
    }

    // Ocultar modal de edición
    function hideEditModal() {
        editModal.style.display = 'none';
    }

    // Guardar cambios y actualizar tabla
    function saveChanges() {
        const id = document.getElementById('edit-id').value;
        const nombre = document.getElementById('edit-nombre').value;
        const valor = document.getElementById('edit-valor').value;
        const descripcion = document.getElementById('edit-descripcion').value;

        // Actualizar los datos en el array
        const item = data.find(item => item.id == id);
        item.nombre = nombre;
        item.valor = valor;
        item.descripcion = descripcion;

        // Actualizar los datos en localStorage
        updateLocalStorage(data);

        // Actualizar la fila de la tabla
        currentRow.children[1].innerText = nombre;
        currentRow.children[2].innerText = valor;
        currentRow.children[3].innerText = descripcion;

        // Guardar los valores actualizados en las variables globales
        lastSavedNombre = nombre;
        lastSavedValor = valor;
        lastSavedDescripcion = descripcion;

        hideEditModal();
    }

    // Evento para manejar clic en el botón Editar
    infoTable.addEventListener('click', function (event) {
        if (event.target.classList.contains('edit-button')) {
            const row = event.target.closest('tr');
            showEditModal(row);
        }
    });

    // Evento para manejar clic en el botón Guardar
    saveEditButton.addEventListener('click', function () {
        saveChanges();
    });

    // Evento para manejar clic en el botón Cancelar
    cancelEditButton.addEventListener('click', function () {
        hideEditModal();
    });

    // Evento para manejar clic en el botón de cerrar (X) del modal
    closeModalButton.addEventListener('click', function () {
        hideEditModal();
    });

    // Cerrar el modal si el usuario hace clic fuera del modal
    window.addEventListener('click', function (event) {
        if (event.target === editModal) {
            hideEditModal();
        }
    });

    // Cargar los datos iniciales en la tabla
    loadTableData();
});

/* */

