// Function to parse query parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}

// Function to calculate and display the results using a matrix
function displayResults() {
    const params = getQueryParams();
    // Array of spiritual gifts
    const gifts = [
        'Administration', 'Apostleship', 'Discernment', 'Evangelism', 'Exhortation',
        'Faith', 'Giving', 'Hospitality', 'Knowledge', 'Leadership',
        'Mercy', 'Prophecy', 'Shepherding', 'Helps/Service', 'Teaching', 'Wisdom'
    ];

    // Initialize the matrix with rows for each gift
    const matrix = gifts.map(gift => [gift, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // Populate the matrix with scores
    Object.keys(params).forEach((key) => {
        if (key.startsWith('q')) {
            const questionIndex = parseInt(key.substring(1)) - 1;
            const giftIndex = Math.floor(questionIndex / 8);
            const responseValue = parseInt(params[key]);

            matrix[giftIndex][(questionIndex % 8) + 1] = responseValue;
        }
    });

    // Calculate the total for each gift
    matrix.forEach(row => {
        row[9] = row.slice(1, 9).reduce((acc, val) => acc + val, 0);
    });

    // Sort the matrix by the total score in descending order
    matrix.sort((a, b) => b[9] - a[9]);

    // Populate the table with the sorted matrix
    const resultsBody = document.getElementById('results-body');
    resultsBody.innerHTML = ''; // Clear any previous results

    matrix.forEach(row => {
        const tableRow = document.createElement('tr');
        tableRow.innerHTML = `
            <td>${row[0]}</td>
            ${row.slice(1, 9).map(score => `<td>${score}</td>`).join('')}
            <td>${row[9]}</td>
        `;
        resultsBody.appendChild(tableRow);
    });
}

function downloadResultsPage() {
    // Select the part of the page to convert to PDF
    const element = document.querySelector('.container'); // Select the results container

    // Configure and generate the PDF
    html2pdf()
        .from(element)
        .set({
            margin: 1,
            filename: 'Spiritual_Assessment_Results.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        })
        .save();
}

// Attach the download function to the button
document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.getElementById('download-btn');
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadResultsPage);
    }
    
    // Call function to display results once the DOM is fully loaded
    displayResults();
});
