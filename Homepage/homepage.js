// Homepage functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get user data from localStorage (set during login)
    const userData = JSON.parse(localStorage.getItem('mindBankUser') || '{}');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Update welcome message - prefer currentUser data if available
    const welcomeUser = document.getElementById('welcomeUser');
    if (currentUser.username) {
        welcomeUser.textContent = `Welcome back, ${currentUser.username}!`;
    } else if (userData.username) {
        welcomeUser.textContent = `Welcome back, ${userData.username}!`;
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', handleLogout);
    
    // Card button functionality (placeholder for future features)
    const cardButtons = document.querySelectorAll('.card-btn');
    cardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.parentElement.querySelector('h3').textContent;
            alert(`${cardTitle} feature coming soon!`);
        });
    });
    
    // Check if user is actually logged in
    if (!userData.isLoggedIn && !currentUser.username) {
        // Redirect to login if not logged in
        window.location.href = '../index.html';
    }
});

function handleLogout() {
    // Clear all user data
    localStorage.removeItem('mindBankUser');
    localStorage.removeItem('currentUser');
    
    // Show logout message
    alert('You have been logged out successfully!');
    
    // Redirect to login page
    window.location.href = '../index.html';
}

// Simulate some dynamic content loading
function loadRecentActivity() {
    // This could be replaced with actual API calls
    const activities = [
        {
            icon: '📝',
            title: 'New note created',
            description: 'Meeting notes from today\'s standup',
            time: '2 hours ago'
        },
        {
            icon: '💡',
            title: 'Idea saved',
            description: 'Mobile app concept for productivity',
            time: 'Yesterday'
        },
        {
            icon: '📚',
            title: 'Knowledge base updated',
            description: 'Added JavaScript best practices',
            time: '3 days ago'
        }
    ];
    
    return activities;
}
