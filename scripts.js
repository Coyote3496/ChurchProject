document.addEventListener('DOMContentLoaded', function() {
    const questions = loadQuestions();
    displayQuestions(questions);

    const form = document.getElementById('questionnaireForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        processForm(questions);
    });

    if (window.location.pathname.endsWith('thank_you.html')) {
        displayResults();
    }
});

function loadQuestions() {
    return [
        "I enjoy organizing details and tasks.",
        // Add all 128 questions here
    ];
}

function displayQuestions(questions) {
    const questionsList = document.getElementById('questionsList');
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
}

function processForm(questions) {
    const responses = [];
    questions.forEach((_, index) => {
        const response = document.querySelector(`input[name="q${index+1}"]:checked`).value;
        responses.push(parseInt(response));
    });

    localStorage.setItem('responses', JSON.stringify(responses));
    window.location.href = 'thank_you.html';
}

function displayResults() {
    const responses = JSON.parse(localStorage.getItem('responses'));
    const giftLabels = [
        'Administration', 'Apostleship', 'Discernment', 'Evangelism', 'Exhortation', 
        'Faith', 'Giving', 'Hospitality', 'Knowledge', 'Leadership', 
        'Mercy', 'Prophecy', 'Shepherding', 'Helps/Service', 'Teaching', 'Wisdom'
    ];

    const detailedResponsesTable = document.getElementById('detailedResponsesTable');
    let totalScores = Array(giftLabels.length).fill(0);

    for (let i = 0; i < giftLabels.length; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${giftLabels[i]}</td>`;

        let total = 0;
        for (let j = 0; j < 8; j++) {
            const score = responses[i * 8 + j];
            total += score;
            row.innerHTML += `<td>${score}</td>`;
        }
        row.innerHTML += `<td>${total}</td>`;
        detailedResponsesTable.appendChild(row);
        totalScores[i] = total;
    }

    displaySummary(totalScores, giftLabels);
}

function displaySummary(totalScores, giftLabels) {
    const summaryContainer = document.getElementById('summaryContainer');

    const sortedScores = totalScores.map((score, index) => ({ score, label: giftLabels[index] }))
                                    .sort((a, b) => b.score - a.score)
                                    .slice(0, 3);

    const summaryHtml = `
        <h2>Your Top Three Spiritual Gifts</h2>
        <table class="summary-table">
            <thead>
                <tr>
                    <th>Gift</th>
                    <th>Total Score</th>
                </tr>
            </thead>
            <tbody>
                ${sortedScores.map(({ label, score }) => `
                    <tr>
                        <td>${label}</td>
                        <td>${score}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    summaryContainer.innerHTML = summaryHtml;
}

