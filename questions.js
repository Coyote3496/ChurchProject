// Function to load questions from the text file
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
        })
        .catch(error => console.error('Error loading questions:', error));
}

// Handle form submission by preventing default form submission and redirecting with query parameters
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form from submitting the traditional way

    const form = document.getElementById('questionnaire-form');
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData).toString();

    // Redirect to results page with data as query parameters
    window.location.href = 'results.html?' + queryString;
}

// Initialize the form and questions on page load
document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    document.getElementById('questionnaire-form').addEventListener('submit', handleFormSubmit);
});
