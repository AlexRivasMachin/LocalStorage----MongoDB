document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('lista-elementos');
    const deleteButton = document.getElementById('Borrar');
    const uploadButton = document.getElementById('Subir');
    const recoverButton = document.getElementById('Recuperar');
    const deleteDataBaseButton = document.getElementById('BorrarBD');

    // Cargar tareas almacenadas en localStorage al cargar la página
    loadTasks();

    // Manejar envío del formulario
    taskForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            saveTasks();
            await sendTaskToServer(taskText);
            taskInput.value = ''; // Limpiar el campo de entrada después de subir la tarea
        }
    });

    // Manejar clic en el botón "Borrar tareas"
    deleteButton.addEventListener('click', async function () {
        clearTasksHTML();
    });

    // Manejar clic en el botón "Borrar tareas y base de datos"
    deleteDataBaseButton.addEventListener('click', async function () {
        await deleteTasksOnServer();
        await deleteTasksOnDataBase();
        clearTasksHTML();
        clearTasksLocalStorage();
    });

    // Función para borrar todas las tareas en la base de datos
    async function deleteTasksOnDataBase() {
        try {
            const response = await fetch('/deleteTasksAtDataBase', {
               method: 'DELETE',
            });
    
           if (response.ok) {
                    console.log('Todas las tareas borradas en el servidor con éxito.');
           } else {
               console.error('Error al borrar todas las tareas en el servidor.');
           }
          } catch (error) {
              console.error('Error en la solicitud fetch:', error);
         }
     }

    // Función para borrar todas las tareas en el servidor
    async function deleteTasksOnServer() {
        try {
            const response = await fetch('/deleteTasks', {
                method: 'DELETE',
            });

            if (response.ok) {
                console.log('Todas las tareas borradas en el servidor con éxito.');
            } else {
                console.error('Error al borrar todas las tareas en el servidor.');
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    }

    // Manejar clic en el botón "Recuperar Tareas"
    recoverButton.addEventListener('click', async function () {
        clearTasksHTML();
        await retrieveTasksFromServer();
    });

    // Manejar clic en el botón "Subir Tarea"
    uploadButton.addEventListener('click', async function () {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            await sendTaskToServer(taskText);
            taskInput.value = ''; // Limpiar el campo de entrada después de subir la tarea
        }
    });

    // Función para agregar una tarea a la lista
    function addTask(taskText) {
        const listItem = document.createElement('li');
        listItem.textContent = taskText;
        taskList.appendChild(listItem);
    }

    // Función para guardar las tareas en localStorage
    function saveTasks() {
        const tasks = Array.from(taskList.children).map(task => task.textContent);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Función para cargar las tareas desde localStorage
    function loadTasks() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            clearTasksHTML();
            const tasks = JSON.parse(storedTasks);
            tasks.forEach(taskText => addTask(taskText));
        }
    }

    // Función para borrar las tareas del HTML
    function clearTasksHTML() {
        taskList.innerHTML = '';
    }

    // Función para borrar las tareas del localStorage
    function clearTasksLocalStorage() {
        localStorage.removeItem('tasks');
    }

    // Función para enviar una tarea al servidor usando fetch y método POST
    async function sendTaskToServer(taskText) {
        try {
            const response = await fetch('/uploadTask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task: taskText }),
            });

            if (response.ok) {
                console.log('Tarea enviada al servidor con éxito.');
            } else {
                console.error('Error al enviar tarea al servidor.');
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    }

    // Función para recuperar tareas del servidor y agregarlas a la lista en el HTML
    async function retrieveTasksFromServer() {
        try {
            const response = await fetch('/retrieveTasks');
            if (response.ok) {
                const tasksFromServer = await response.json();
                tasksFromServer.forEach(taskText => addTask(taskText));
                saveTasks(); // Guardar también en localStorage
                console.log('Tareas recuperadas del servidor con éxito.');
            } else {
                console.error('Error al recuperar tareas del servidor.');
            }
        } catch (error) {
            console.error('Error en la solicitud fetch:', error);
        }
    }
});
