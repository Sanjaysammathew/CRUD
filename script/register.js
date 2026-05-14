//  Regex 
const emailRegex = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
const passRegex  = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const userRegex  = /^[A-Za-z0-9@#_]+$/;
const phoneRegex = /^\d{10}$/;

//  Inputs 
const userInput    = document.getElementById('userInput');
const emailInput   = document.getElementById('emailInput');
const passInput    = document.getElementById('passInput');
const confirmInput = document.getElementById('confirmInput');
const numInput     = document.getElementById('num');
const dateInput    = document.getElementById('dateInput');
const roleSelect   = document.getElementById('roleSelect');
const addressInput = document.getElementById('addressInput');

// Error Divs 
const userError    = document.getElementById('invalid-username');
const emailError   = document.getElementById('invalid-email');
const passError    = document.getElementById('invalid-password');
const confirmError = document.getElementById('invalid-confirm');
const numError     = document.getElementById('invalid-number');
const dateError    = document.getElementById('invalid-date');
const roleError    = document.getElementById('invalid-role');
const addressError = document.getElementById('invalid-address');

// Helpers 
function setError(input, errorDiv, message) {
  errorDiv.innerText = message;
  input.classList.add('is-invalid');
  input.classList.remove('is-valid');
}

function clearError(input, errorDiv) {
  errorDiv.innerText = '';
  input.classList.remove('is-invalid');
  input.classList.add('is-valid');
}

// Form Submit
document.getElementById('register-form').addEventListener('submit', (e) => {
  e.preventDefault();
  let isValid = true;

  // Username
  if (userInput.value.trim() === '') {
    setError(userInput, userError, 'Username is required.');
    isValid = false;
  } else if (userInput.value.trim().length < 3) {
    setError(userInput, userError, 'Username must be at least 3 characters.');
    isValid = false;
  } else if (!userRegex.test(userInput.value.trim())) {
    setError(userInput, userError, 'Only letters, numbers, @, #, _ are allowed.');
    isValid = false;
  } else {
    clearError(userInput, userError);
  }

  // Email
  if (emailInput.value.trim() === '') {
    setError(emailInput, emailError, 'Email is required.');
    isValid = false;
  } else if (!emailRegex.test(emailInput.value.trim())) {
    setError(emailInput, emailError, 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError(emailInput, emailError);
  }

  // Password
  if (passInput.value === '') {
    setError(passInput, passError, 'Password is required.');
    isValid = false;
  } else if (!passRegex.test(passInput.value)) {
    setError(passInput, passError, 'Min 8 chars with uppercase, lowercase, number & symbol.');
    isValid = false;
  } else {
    clearError(passInput, passError);
  }

  // Confirm Password
  if (confirmInput.value === '') {
    setError(confirmInput, confirmError, 'Please confirm your password.');
    isValid = false;
  } else if (confirmInput.value !== passInput.value) {
    setError(confirmInput, confirmError, 'Passwords do not match.');
    isValid = false;
  } else {
    clearError(confirmInput, confirmError);
  }

  // Phone Number
  if (numInput.value.trim() === '') {
    setError(numInput, numError, 'Phone number is required.');
    isValid = false;
  } else if (!phoneRegex.test(numInput.value.trim())) {
    setError(numInput, numError, 'Enter a valid 10-digit phone number.');
    isValid = false;
  } else {
    clearError(numInput, numError);
  }

  // Birth Date
  if (dateInput.value === '') {
    setError(dateInput, dateError, 'Birth date is required.');
    isValid = false;
  } else {
    const today = new Date();
    const birth = new Date(dateInput.value);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    if (age < 13) {
      setError(dateInput, dateError, 'You must be at least 13 years old.');
      isValid = false;
    } else {
      clearError(dateInput, dateError);
    }
  }

  // Role
  if (roleSelect.value === '') {
    setError(roleSelect, roleError, 'Please select a work role.');
    isValid = false;
  } else {
    clearError(roleSelect, roleError);
  }

  // Address
  if (addressInput.value.trim() === '') {
    setError(addressInput, addressError, 'Address is required.');
    isValid = false;
  } else if (addressInput.value.trim().length < 10) {
    setError(addressInput, addressError, 'Please enter a complete address.');
    isValid = false;
  } else {
    clearError(addressInput, addressError);
  }

  // Success
  if (isValid) {
  
   Swal.fire({
    icon: 'success',
    title: 'Registered Successfully',
    text: 'Welcome to Taskflow!',
    confirmButtonText: 'Go to Login'
  }).then(() => {
    window.location.href = './login.html';  
  });
    
  }
});

// Theme Toggle 
const themeToggler = document.getElementById('themeToggler');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    themeToggler.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-bs-theme');
      if (currentTheme === 'light') {
        html.setAttribute('data-bs-theme', 'dark');
        themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
      } else {
        html.setAttribute('data-bs-theme', 'light');
        themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
      }
    });