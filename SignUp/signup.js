// Mock database for checking uniqueness (in a real app, this would be server-side)
const existingEmails = ['test@example.com', 'user@mindbank.com'];
const existingUsernames = ['testuser', 'admin', 'user123'];

// Form elements
const form = document.getElementById('signupForm');
const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Error message elements
const emailError = document.getElementById('emailError');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');

// Password requirement elements
const lengthReq = document.getElementById('length');
const letterReq = document.getElementById('letter');
const numberReq = document.getElementById('number');
const symbolReq = document.getElementById('symbol');

// Validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const letterPattern = /[a-zA-Z]/;
const numberPattern = /[0-9]/;
const symbolPattern = /[!@#$%^&*(),.?":{}|<>]/;

// Real-time validation
emailInput.addEventListener('blur', validateEmail);
emailInput.addEventListener('input', clearError);
usernameInput.addEventListener('blur', validateUsername);
usernameInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', validatePassword);
confirmPasswordInput.addEventListener('input', validateConfirmPassword);

// Form submission
form.addEventListener('submit', handleSubmit);

function validateEmail() {
    const email = emailInput.value.trim();
    let isValid = true;
    
    if (!email) {
        showError(emailError, 'Email address is required');
        isValid = false;
    } else if (!emailPattern.test(email)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    } else if (existingEmails.includes(email.toLowerCase())) {
        showError(emailError, 'This email address is already registered');
        isValid = false;
    } else {
        clearError(emailError);
    }
    
    updateInputState(emailInput, isValid);
    return isValid;
}

function validateUsername() {
    const username = usernameInput.value.trim();
    let isValid = true;
    
    if (!username) {
        showError(usernameError, 'Username is required');
        isValid = false;
    } else if (username.length < 3) {
        showError(usernameError, 'Username must be at least 3 characters long');
        isValid = false;
    } else if (username.length > 20) {
        showError(usernameError, 'Username must be less than 20 characters');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        showError(usernameError, 'Username can only contain letters, numbers, hyphens, and underscores');
        isValid = false;
    } else if (existingUsernames.includes(username.toLowerCase())) {
        showError(usernameError, 'This username is already taken');
        isValid = false;
    } else {
        clearError(usernameError);
    }
    
    updateInputState(usernameInput, isValid);
    return isValid;
}

function validatePassword() {
    const password = passwordInput.value;
    let isValid = true;
    
    // Check length
    if (password.length >= 5) {
        lengthReq.classList.add('valid');
    } else {
        lengthReq.classList.remove('valid');
        isValid = false;
    }
    
    // Check for letter
    if (letterPattern.test(password)) {
        letterReq.classList.add('valid');
    } else {
        letterReq.classList.remove('valid');
        isValid = false;
    }
    
    // Check for number
    if (numberPattern.test(password)) {
        numberReq.classList.add('valid');
    } else {
        numberReq.classList.remove('valid');
        isValid = false;
    }
    
    // Check for symbol
    if (symbolPattern.test(password)) {
        symbolReq.classList.add('valid');
    } else {
        symbolReq.classList.remove('valid');
        isValid = false;
    }
    
    if (!password) {
        showError(passwordError, 'Password is required');
        isValid = false;
    } else if (!isValid) {
        showError(passwordError, 'Password does not meet all requirements');
    } else {
        clearError(passwordError);
    }
    
    updateInputState(passwordInput, isValid);
    
    // Re-validate confirm password if it has a value
    if (confirmPasswordInput.value) {
        validateConfirmPassword();
    }
    
    return isValid;
}

function validateConfirmPassword() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    let isValid = true;
    
    if (!confirmPassword) {
        showError(confirmPasswordError, 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError(confirmPasswordError, 'Passwords do not match');
        isValid = false;
    } else {
        clearError(confirmPasswordError);
    }
    
    updateInputState(confirmPasswordInput, isValid);
    return isValid;
}

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(errorElementOrEvent) {
    let errorElement;
    if (errorElementOrEvent.target) {
        // Called from input event
        const input = errorElementOrEvent.target;
        const errorId = input.id + 'Error';
        errorElement = document.getElementById(errorId);
    } else {
        // Called directly with error element
        errorElement = errorElementOrEvent;
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function updateInputState(input, isValid) {
    input.classList.remove('valid', 'invalid');
    if (input.value.trim()) {
        input.classList.add(isValid ? 'valid' : 'invalid');
    }
}

function handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const emailValid = validateEmail();
    const usernameValid = validateUsername();
    const passwordValid = validatePassword();
    const confirmPasswordValid = validateConfirmPassword();
    
    if (emailValid && usernameValid && passwordValid && confirmPasswordValid) {
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        form.classList.add('loading');
        
        // Simulate API call (replace with actual server request)
        setTimeout(() => {
            // Store the new account details
            const newAccount = {
                email: emailInput.value.toLowerCase(),
                username: usernameInput.value.trim(),
                password: passwordInput.value, // In real app, this would be hashed
                createdAt: new Date().toISOString(),
                id: Date.now().toString() // Simple ID generation
            };
            
            // Save to localStorage (simulating file storage)
            saveAccountToStorage(newAccount);
            
            // Add the new email and username to the existing arrays for immediate validation
            existingEmails.push(emailInput.value.toLowerCase());
            existingUsernames.push(usernameInput.value.toLowerCase());
            
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = 'Account created successfully! Redirecting to login...';
            form.parentNode.insertBefore(successDiv, form);
            
            // Redirect to login page after a delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
            
        }, 1500);
    } else {
        // Scroll to first error
        const firstError = form.querySelector('.error-message:not(:empty)');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Add some pre-existing data for testing uniqueness
document.addEventListener('DOMContentLoaded', function() {
    // Load existing accounts from storage
    loadExistingAccounts();
    
    // You can remove this in production
    console.log('Existing emails for testing:', existingEmails);
    console.log('Existing usernames for testing:', existingUsernames);
});

// Account storage functions
function saveAccountToStorage(accountData) {
    try {
        // Get existing accounts
        let accounts = JSON.parse(localStorage.getItem('mindBankAccounts') || '[]');
        
        // Add new account
        accounts.push(accountData);
        
        // Save back to localStorage
        localStorage.setItem('mindBankAccounts', JSON.stringify(accounts));
        
        // Also save to a downloadable text format for reference
        saveAccountsToTextFile(accounts);
        
        console.log('Account saved successfully:', accountData.username);
    } catch (error) {
        console.error('Error saving account:', error);
    }
}

function loadExistingAccounts() {
    try {
        // Get accounts from localStorage
        const accounts = JSON.parse(localStorage.getItem('mindBankAccounts') || '[]');
        
        // Update the existing arrays with stored account data
        accounts.forEach(account => {
            if (!existingEmails.includes(account.email)) {
                existingEmails.push(account.email);
            }
            if (!existingUsernames.includes(account.username.toLowerCase())) {
                existingUsernames.push(account.username.toLowerCase());
            }
        });
        
        console.log(`Loaded ${accounts.length} accounts from storage`);
    } catch (error) {
        console.error('Error loading accounts:', error);
    }
}

function saveAccountsToTextFile(accounts) {
    try {
        // Create a text representation of accounts (without passwords for security)
        let textContent = 'Mind Bank - User Accounts\n';
        textContent += '========================\n\n';
        
        accounts.forEach((account, index) => {
            textContent += `Account ${index + 1}:\n`;
            textContent += `  Email: ${account.email}\n`;
            textContent += `  Username: ${account.username}\n`;
            textContent += `  Created: ${new Date(account.createdAt).toLocaleString()}\n`;
            textContent += `  ID: ${account.id}\n\n`;
        });
        
        // Save to localStorage for download reference
        localStorage.setItem('mindBankAccountsText', textContent);
        
        console.log('Account text file updated');
    } catch (error) {
        console.error('Error creating text file:', error);
    }
}

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

// Debug functions for development
function viewStoredAccounts() {
    const accounts = JSON.parse(localStorage.getItem('mindBankAccounts') || '[]');
    console.table(accounts);
    return accounts;
}

function downloadAccountsFile() {
    const textContent = localStorage.getItem('mindBankAccountsText') || 'No accounts found';
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindbank_accounts.txt';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Expose debug functions to console (for development)
window.mindBankDebug = {
    viewAccounts: viewStoredAccounts,
    downloadFile: downloadAccountsFile,
    clearAccounts: () => {
        localStorage.removeItem('mindBankAccounts');
        localStorage.removeItem('mindBankAccountsText');
        console.log('All accounts cleared');
    }
};
