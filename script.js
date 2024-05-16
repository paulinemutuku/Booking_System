document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointment-form');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const submitBtn = document.getElementById('submit-btn');

    // Initialize Flatpickr on the date input with disabled weekends
    flatpickr(dateInput, {
        minDate: "today",
        dateFormat: "Y-m-d",
        "disable": [
            function(date) {
                // Disable weekends
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                const day = selectedDates[0].getDay();
                // Reset the time select options
                timeSelect.innerHTML = '<option value="">Select a time slot</option>';

                if (day !== 0 && day !== 6) {
                    // Populate time slots only for weekdays and include AM/PM notation
                    const slots = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
                    slots.forEach(slot => {
                        let option = document.createElement('option');
                        option.value = slot;
                        option.textContent = slot;
                        timeSelect.appendChild(option);
                    });
                }
            }
        }
    });

    submitBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const date = dateInput.value;
        const time = timeSelect.value;

        if (!name || !email || !date || !time) {
            displayMessage('Please fill in all fields.', 'error');
            return;
        }

        // Check if the time slot is already taken
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const isTaken = appointments.some(appointment => appointment.date === date && appointment.time === time);

        if (isTaken) {
            displayMessage('This time slot is already taken. Please select another time.', 'error');
            return;
        }

        // Send the valid data to the server
        fetch('http://localhost:3000/book-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                date: date,
                time: time
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            displayMessage(`Thank you, ${name}. Your appointment for ${date} at ${time} has been scheduled.`, 'success');
            form.reset(); // Reset the form after successful submission
        })
        .catch((error) => {
            console.error('Error:', error);
            displayMessage('Error booking your appointment. Please try again.', 'error');
        });
    });

    // function displayMessage(message, type) {
    //     const messageElement = document.createElement('div');
    //     messageElement.textContent = message;
    //     messageElement.className = type; // 'success' or 'error' for styling
    //     document.body.insertBefore(messageElement, form);

    //     setTimeout(() => {
    //         document.body.removeChild(messageElement);
    //     }, 5000);
    // }

    function displayMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        messageElement.className = type; // 'success' or 'error' for styling
        
        // Insert the message element before the form
        if (form.parentNode) {
            form.parentNode.insertBefore(messageElement, form);
        } else {
            document.body.appendChild(messageElement); // Fallback if form's parent node is not found
        }
    
        setTimeout(() => {
            // Check if the message element is still in the DOM before removing it
            if (document.body.contains(messageElement)) {
                document.body.removeChild(messageElement);
            }
        }, 5000);
    }    
      
});
