let autoFillEnabled = false;

function loadQuestions() {
    fetch('questions.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            const questionsList = document.getElementById('questions-list');
            const questions = data.trim().split('\n');
            questions.forEach((question, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    ${question}<br>
                    <label><input type="radio" name="q${index+1}" value="3" required> Much</label>
                    <label><input type="radio" name="q${index+1}" value="2"> Some</label>
                    <label><input type="radio" name="q${index+1}" value="1"> Little</label>
                    <label><input type="radio" name="q${index+1}" value="0"> None</label>
                `;
                questionsList.appendChild(listItem);
            });

            // Auto-fill answers if enabled
            if (autoFillEnabled) {
                autoFillAnswers();
            }
        })
        .catch(error => console.error('Error loading questions:', error));
}

function autoFillAnswers() {
    // Auto-fill radio buttons for questions
    const questionsCount = document.querySelectorAll('#questions-list li').length;
    for (let i = 1; i <= questionsCount; i++) {
        const randomValue = Math.floor(Math.random() * 4);
        const radio = document.querySelector(`input[name="q${i}"][value="${randomValue}"]`);
        if (radio) {
            radio.checked = true;
        }
    }

    // Auto-fill optional fields
    const optionalFields = {
        gender: ['Male', 'Female', 'Non-binary', 'Other'],
        age: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
        marriage_status: ['Married', 'Unmarried', 'Divorced'],
        christian_status: ['0-1 years', '1-5 years', '6-10 years', '11+']
    };

    Object.keys(optionalFields).forEach(field => {
        const options = optionalFields[field];
        const randomValue = options[Math.floor(Math.random() * options.length)];
        const radio = document.querySelector(`input[name="${field}"][value="${randomValue}"]`);
        if (radio) {
            radio.checked = true;
        }
    });
}

function toggleAutoFill() {
    autoFillEnabled = !autoFillEnabled;
    const statusText = document.getElementById('autofill-status');
    const toggleButton = document.getElementById('toggle-autofill');

    if (autoFillEnabled) {
        statusText.textContent = 'Auto-Fill is Enabled';
        toggleButton.textContent = 'Disable Auto-Fill';
        autoFillAnswers(); // Auto-fill answers immediately if enabled
    } else {
        statusText.textContent = 'Auto-Fill is Disabled';
        toggleButton.textContent = 'Enable Auto-Fill';
    }
}

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    const form = document.getElementById('questionnaire-form');
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData).toString();
    
    // Optionally: Store form data in local storage or send to server

    // Redirect to results page with data
    window.location.href = 'results.html?' + queryString;
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    document.getElementById('toggle-autofill').addEventListener('click', toggleAutoFill);
    document.getElementById('questionnaire-form').addEventListener('submit', handleFormSubmit);
});
