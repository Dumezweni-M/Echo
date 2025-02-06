
        // Control "OPTIONS" modal
        document.addEventListener('DOMContentLoaded', function() {

        setTimeout( () => {

        },1000)

        const optionsButtons = document.querySelectorAll('.optionsBtn')
        const taskModals = document.querySelectorAll('.taskOptions')
        // const closeButton = document.getElementById('closeButton')

        optionsButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const modal = taskModals[index];
                modal.showModal();
            });
        });

        // Cliking anywhere else on the screen makes modal disappear
        taskModals.forEach((modal) => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.close();
                }
            });
        });


        // Fetch Data and Delete selected Item
        const deleteButtons = document.querySelectorAll('.deleteButton');
        
        deleteButtons.forEach(deleteButton => {
            deleteButton.addEventListener('click', (e) => {
                const id = deleteButton.dataset.doc;
        
                const endpoint = `/delete/task/${id}`;
        
                fetch(endpoint, {
                    method: 'DELETE'
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network Response Issue, FETCH API')
                    }
                    return response.json();
                })
                .then((data) => {
                    window.location.href = data.redirect; // Redirect on successful delete
                })
                .catch((err) => console.log('Error: catch FETCH API', err));
            });
        
        
            // Edit tasks
            const editButtons = document.querySelectorAll('.editButton');
            const saveButtons = document.querySelectorAll('.saveButton');
            const cancelButtons = document.querySelectorAll('.cancelButton');
        
            // Edit Mode
                editButtons.forEach((editButton) => {
                editButton.addEventListener('click', () => {
                
                const taskId = editButton.dataset.doc;
                const taskItem = document.querySelector(`#taskItem-${taskId}`);

                console.log("Edit initiated")
                
                // Get task element and apply edit mode
                const taskText = taskItem.querySelector('.task .view-mode');
                const taskInput = taskItem.querySelector('.task .edit-mode');
                const priorityText = taskItem.querySelector('.priority .view-mode');
                const prioritySelect = taskItem.querySelector('.priority .edit-mode')
                const dateText = taskItem.querySelector('.view-mode.date');
                const dateinput = taskItem.querySelector('input[type="date"].edit-mode');
                const frequencyText = taskItem.querySelector('.frequency .view-mode');
                const frequencySelect = taskItem.querySelector('.frequency .edit-mode');
                const statusText = taskItem.querySelector('.status .view-mode');
                const statusSelect = taskItem.querySelector('.status .edit-mode');
        
                // Toggle visibility
                taskText.classList.add('hidden');
                taskInput.classList.remove('hidden');
                priorityText.classList.add('hidden');
                prioritySelect.classList.remove('hidden');
                dateText.classList.add('hidden');
                dateinput.classList.remove('hidden');
                frequencyText.classList.add('hidden');
                frequencySelect.classList.remove('hidden');
                statusText.classList.add('hidden');
                statusSelect.classList.remove('hidden');
                
                // Show Save/Cancel buttons and hide Edit button
                editButton.classList.add('hidden');
                taskItem.querySelector('.saveButton').classList.remove('hidden');
                taskItem.querySelector('.cancelButton').classList.remove('hidden');
        
                const modal = taskItem.querySelector('.taskOptions');
                modal.close();
            });
        });
        
        // Save Changes
        saveButtons.forEach((saveButton) => {
            saveButton.addEventListener('click', () => {
                const taskId = saveButton.dataset.doc;
                const taskItem = document.querySelector(`#taskItem-${taskId}`);
                
               
                
                const updatedTaskName = taskItem.querySelector('.task .edit-mode').value;
                const updatedPriority = taskItem.querySelector('.priority select.edit-mode').value;
                const updatedDate = taskItem.querySelector('input[type="date"].edit-mode').value
                const updatedFrequency = taskItem.querySelector('.frequency select.edit-mode').value
                const updatedStatus = taskItem.querySelector('.status select.edit-mode').value
                
                 // On save returns blank result for edited task until page refresh. "I am here as a patch"
                location.reload();

                // Send update to backend
                fetch(`/edit/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        task: updatedTaskName,
                        priority: updatedPriority,
                        dueDate: updatedDate,
                        frequency: updatedFrequency,
                        status: updatedStatus,
                    }),
                })
                    .then((response) => {
                        if (!response.ok) throw new Error('Failed to update task');
                        return response.json();
                    })
                    .then((data) => {
                        // Update UI
                        taskItem.querySelector('.task .view-mode').textContent = updatedTaskName;
                        taskItem.querySelector('select').value = updatedPriority;
                        taskItem.querySelector('.view-mode.date').textContent = new Date(updatedDate).toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short'});
                        taskItem.querySelector('.frequency .view-mode').textContent = updatedFrequency;
                        taskItem.querySelector('.status .view-mode').textContent = updatedStatus;
        
                        
                        // Exit edit mode (TODO: Put me in a function)
                        taskItem.querySelector('.task .edit-mode').classList.add('hidden');
                        taskItem.querySelector('.task .view-mode').classList.remove('hidden');
                        taskItem.querySelector('.Priority .edit-mode').classList.add('hidden');
                        taskItem.querySelector('.Priority .view-mode').classList.remove('hidden');
                        taskItem.querySelector('input[type="date"].edit-mode').classList.add('hidden');
                        taskItem.querySelector('.view-mode.date').classList.remove('hidden');
                        taskItem.querySelector('.frequency .edit-mode').classList.add('hidden');
                        taskItem.querySelector('.frequency .view-mode').classList.remove('hidden');
                        taskItem.querySelector('.status .edit-mode').classList.add('hidden');
                        taskItem.querySelector('.status .view-mode').classList.remove('hidden');
        
                        saveButton.classList.add('hidden');
                        taskItem.querySelector('.cancelButton').classList.add('hidden');
                        taskItem.querySelector('.editButton').classList.remove('hidden');
        

                        const modal = taskItem.querySelector('.taskOptions');
                        modal.close();
                        
                        
                    })
                    .catch((error) => console.error('Error updating task:', error));
            });
        });
        
        // Cancel Edit
        cancelButtons.forEach((cancelButton) => {
            cancelButton.addEventListener('click', () => {
                const taskId = cancelButton.dataset.doc;
                const taskItem = document.querySelector(`#taskItem-${taskId}`);
                
                const taskText = taskItem.querySelector('.view-mode');
                const taskInput = taskItem.querySelector('.edit-mode');
                const prioritySelect = taskItem.querySelector('select.edit-mode');
                const priorityView = taskItem.querySelector('.view-mode.priority');
                const dateText = taskItem.querySelector('.view-mode.date');
                const dateInput = taskItem.querySelector('input[type="date"].edit-mode');

                // location.reload(); //See same function on save click Listener.
        
                // Restore original value
                taskInput.value = taskText.textContent;
                prioritySelect.value = priorityView.textContent;
                dateInput.value = new Date(dateText.textContent).toISOString().split('T')[0];
        
                // Toggle visibility
                taskInput.classList.add('hidden');
                taskText.classList.remove('hidden');
                dateInput.classList.add('hidden');
                dateText.classList.remove('hidden');
        
                cancelButton.classList.add('hidden');
                taskItem.querySelector('.saveButton').classList.add('hidden');
                taskItem.querySelector('.editButton').classList.remove('hidden');
        
        
                const modal = taskItem.querySelector('.taskOptions');
                modal.close();
            });
        });
        
        
        
    });
    
    
    
   
});
