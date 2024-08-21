// Function to parse query parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params.entries()) {
        result[key] = value;
    }
    return result;
}

// Function to save raw data to CSV
function saveToCSV(params) {
    const csvData = Object.values(params).join(",") + "\n";
    
    fetch('save_csv.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(csvData)}`
    }).then(response => {
        if (!response.ok) {
            console.error('Failed to save data to CSV');
        }
    });
}

// Function to calculate and display the results using a matrix
function displayResults() {
    const params = getQueryParams();

    // Save raw data to CSV
    saveToCSV(params);

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

// Call function to display results once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', displayResults);
