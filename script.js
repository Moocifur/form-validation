// script.js

// Validation rules for our fields
const validationRules = {
    email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Freakin enter a valid email pfft',
        emptyMessage: 'Email cant be empty'
    },
    country: {
        emptyMessage: 'gotta select a cuntry'
    },
    postal: {
        //We'll update this based on selected country
        US: {
            pattern: /^\d{5}$/,
            message: 'US postal code must be 5 US digits'
        },
        UK: {
            pattern: /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/,
            message: 'Please enter a valid Dr Who postal code'
        },
        CA: {
            pattern: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] \d[ABCEGHJ-NPRSTV-Z]\d$/,
            message: 'Postal code of the candians dats valid aye'
        },
        emptyMessage: 'Postal code is required'
    },
    password: {
        minLength: 8,
        pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        message: '8 chars, 1 up 1 num, 1 special char',
        emptyMessage: 'bruh enter a password its empty'
    },
    confirmPassword: {
        mismatchMessage: 'aint the same foo',
        emptyMessage: 'Please confirm your password'
    }
};

// Helper function to show error
function showError(input, errorElement, message) {
    input.setCustomValidity(message);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Helper function to clear error
function clearError(input, errorElement) {
    input.setCustomValidity('');
    errorElement.style.display = 'none';
}

// Get all our form elements
const form = document.getElementById('validation-form');
const emailInput = document.getElementById('email');
const emailError = document.getElementById('email-error');
const countrySelect = document.getElementById('country');
const countryError = document.getElementById('country-error');
const postalInput = document.getElementById('postal');
const postalError = document.getElementById('postal-error');
const passwordInput = document.getElementById('password');
const passwordError = document.getElementById('password-error');
const confirmInput = document.getElementById('confirm-password');
const confirmError = document.getElementById('confirm-password-error');

// Email validation function
function validateEmail() {
    const email = emailInput.value.trim();

    if (email === '') {
        showError(emailInput, emailError, validationRules.email.emptyMessage);
    }
    else if (!validationRules.email.pattern.test(email)) {
        showError(emailInput, emailError, validationRules.email.message);
    }
    else {
        clearError(emailInput, emailError);
    }
}

// Country validation function
function validateCountry() {
    if (countrySelect.value === '') {
        showError(countrySelect, countryError, validationRules.country.emptyMessage);
    } else {
        clearError(countrySelect, countryError);
        // Since country affects postal code, re-validate postal when country changes
        validatePostal(); 
    }
}

// Postal code validation
function validatePostal() {
    const postalCode = postalInput.value.trim();
    const country = countrySelect.value;

    if (postalCode === '') {
        showError(postalInput, postalError, validationRules.postal.emptyMessage);
    }
    else if (country && validationRules.postal[country]) { // if exactly this is true?
        // If we have rules for this country
        if (!validationRules.postal[country].pattern.test(postalCode)) {
            showError(postalInput, postalError, validationRules.postal[country].message);
        } else {
            clearError(postalInput, postalError);
        }
    } else {
        // If country not selected or we don't have rules for it
        clearError(postalInput, postalError);
    }
}

// Password validation
function validatePassword() {
    const password = passwordInput.value;

    if (password === '') {
        showError(passwordInput, passwordError, validationRules.password.emptyMessage);
    }
    else if (password.length < validationRules.password.minLength) {
        showError(passwordInput, passwordError, `Password must be at least ${validationRules.password.minLength} characters`);
    }
    else if (!validationRules.password.pattern.test(password)) {
        showError(passwordInput, passwordError, validationRules.password.message);
    }
    else {
        clearError(passwordInput, passwordError);
    }

    // Since password affecs confirmation, re-validate it
    validateConfirmPassword();
}

function validateConfirmPassword() {
    const confirmValue = confirmInput.value;
    const password = passwordInput.value;

    if (confirmValue === '') {
        showError(confirmInput, confirmError, validationRules.confirmPassword.emptyMessage);
    }
    else if (confirmValue != password) {
        showError(confirmInput, confirmError, validationRules.confirmPassword.mismatchMessage);
    }
    else {
        clearError(confirmInput, confirmError);
    }
}

// Add event listeners
emailInput.addEventListener('input', validateEmail);
emailInput.addEventListener('blur', validateEmail);
countrySelect.addEventListener('change', validateCountry);
postalInput.addEventListener('input', validatePostal);
postalInput.addEventListener('blur', validatePostal);
passwordInput.addEventListener('input', validatePassword);
passwordInput.addEventListener('blur', validatePassword);
confirmInput.addEventListener('input', validateConfirmPassword);
confirmInput.addEventListener('blur', validateConfirmPassword);

//Form submisstion
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Validate all fields
    validateEmail();
    validateCountry();
    validatePostal();
    validatePassword();
    validateConfirmPassword();

    // Check if form is valid
    if (form.checkValidity()) {
        // Show success message!
        alert('High five! Form submitted successfully! 🖐️');
        form.reset();
    } else {
        // Show error message
        alert('Please fix the errors in the form before submitting!')
    }
});