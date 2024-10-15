async function fetchLeaderboardData() {
    const apiKey = '46cfb2a080302cde901da6204e739908';
    const apiUrl = `https://affiliates.chicken.gg/v1/referrals?key=${apiKey}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
        const data = await response.json();
        console.log(data);  // Log the API response to see its structure
        return data; // Return the full data so we can inspect it
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        return [];
    }
}

async function populateLeaderboard() {
    const leaderboardData = await fetchLeaderboardData();
    const referrals = leaderboardData.referrals || []; // Access the referrals array

    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';

    if (referrals.length === 0) {
        leaderboardElement.innerHTML = '<tr><td colspan="4">No data available</td></tr>';
        return;
    }

    // Sort referrals by wagerAmount in descending order (highest first)
    referrals.sort((a, b) => b.wagerAmount - a.wagerAmount);

    referrals.forEach((player, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.displayName || 'N/A'}</td>
            <td>$${player.wagerAmount || 'N/A'}</td>
            <td>${getWeeklyReward(index + 1)}</td>
        `;
        leaderboardElement.appendChild(row);
    });
}

function getWeeklyReward(rank) {
    switch(rank) {
        case 1: return '$25';
        case 2: return '$20';
        case 3: return '$15';
        case 4: return '$10';
        case 5: return '$5';
        default: return '$0';
    }
}

window.onload = () => {
    populateLeaderboard();
    setInterval(populateLeaderboard, 300000); // Refresh every 5 minutes
};
