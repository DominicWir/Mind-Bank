// Login functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

// Password toggle functionality
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(inputId + '-toggle-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const loginForm = e.target;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    // Basic validation
    if (!username || !password) {
        showLoginError('Please enter both username and password');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    // Clear any previous errors
    clearLoginError();
    
    // Simulate login API call (replace with actual authentication)
    setTimeout(() => {
        // Mock authentication - in a real app, this would be a server request
        if (authenticateUser(username, password)) {
            // Store user data in localStorage
            const userData = {
                username: username,
                isLoggedIn: true,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('mindBankUser', JSON.stringify(userData));
            
            // Show success message
            showLoginSuccess('Login successful! Redirecting...');
            
            // Redirect to homepage after a short delay
            setTimeout(() => {
                window.location.href = 'Homepage/homepage.html';
            }, 1500);
            
        } else {
            // Show error message
            showLoginError('Invalid username or password. Please try again.');
            
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }, 1000);
}

function authenticateUser(username, password) {
    try {
        // Get stored accounts
        const accounts = JSON.parse(localStorage.getItem('mindBankAccounts') || '[]');
        
        // Check if user exists in stored accounts
        const foundAccount = accounts.find(account => 
            (account.username.toLowerCase() === username.toLowerCase() || 
             account.email.toLowerCase() === username.toLowerCase()) && 
            account.password === password
        );
        
        if (foundAccount) {
            // Store the found account info for use in homepage
            localStorage.setItem('currentUser', JSON.stringify({
                id: foundAccount.id,
                username: foundAccount.username,
                email: foundAccount.email
            }));
            return true;
        }
        
        // Fallback to demo accounts if no stored accounts found
        const demoUsers = [
            { username: 'demo', password: 'demo123' },
            { username: 'testuser', password: 'password123!' },
            { username: 'admin', password: 'admin@123' }
        ];
        
        const demoUser = demoUsers.find(user => 
            user.username.toLowerCase() === username.toLowerCase() && 
            user.password === password
        );
        
        if (demoUser) {
            // Store demo user info
            localStorage.setItem('currentUser', JSON.stringify({
                id: 'demo_' + Date.now(),
                username: demoUser.username,
                email: demoUser.username + '@demo.com'
            }));
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Authentication error:', error);
        return false;
    }
}

function showLoginError(message) {
    // Remove any existing error messages
    clearLoginError();
    
    const form = document.querySelector('form');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.textContent = message;
    
    // Insert error message before the form
    form.parentNode.insertBefore(errorDiv, form);
}

function showLoginSuccess(message) {
    // Remove any existing messages
    clearLoginError();
    
    const form = document.querySelector('form');
    const successDiv = document.createElement('div');
    successDiv.className = 'login-success';
    successDiv.textContent = message;
    
    // Insert success message before the form
    form.parentNode.insertBefore(successDiv, form);
}

function clearLoginError() {
    const existingError = document.querySelector('.login-error');
    const existingSuccess = document.querySelector('.login-success');
    
    if (existingError) {
        existingError.remove();
    }
    
    if (existingSuccess) {
        existingSuccess.remove();
    }
}
