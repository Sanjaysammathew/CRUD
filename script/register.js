const emailRegex = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
const passRegex  = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const userRegex  = /^[A-Za-z0-9@#_]+$/;
const phoneRegex = /^\d{10}$/;

const userInput    = document.getElementById('userInput');
const emailInput   = document.getElementById('emailInput');
const passInput    = document.getElementById('passInput');
const confirmInput = document.getElementById('confirmInput');
const numInput     = document.getElementById('num');
const dateInput    = document.getElementById('dateInput');
const roleSelect   = document.getElementById('roleSelect');
const addressInput = document.getElementById('addressInput');
const termsCheck   = document.getElementById('termsCheck');

const userError    = document.getElementById('invalid-username');
const emailError   = document.getElementById('invalid-email');
const passError    = document.getElementById('invalid-password');
const confirmError = document.getElementById('invalid-confirm');
const numError     = document.getElementById('invalid-number');
const dateError    = document.getElementById('invalid-date');
const roleError    = document.getElementById('invalid-role');
const addressError = document.getElementById('invalid-address');

window.addEventListener("DOMContentLoaded", () => {

  userInput.value = localStorage.getItem("username") || "";
  emailInput.value = localStorage.getItem("email") || "";
  passInput.value = localStorage.getItem("password") || "";
  confirmInput.value = localStorage.getItem("confirmPassword") || "";
  numInput.value = localStorage.getItem("phone") || "";
  dateInput.value = localStorage.getItem("dob") || "";
  roleSelect.value = localStorage.getItem("role") || "";
  addressInput.value = localStorage.getItem("address") || "";

});
const API = 'http://localhost:3000/users';

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



function validateUsername() {
  const value = userInput.value.trim();

  if (value === '') {
    setError(userInput, userError, 'Username is required.');
    return false;
  }

  if (value.length < 3) {
    setError(userInput, userError, 'Username must be at least 3 characters.');
    return false;
  }

  if (!userRegex.test(value)) {
    setError(userInput, userError, 'Only letters, numbers, @, #, _ are allowed.');
    return false;
  }

  clearError(userInput, userError);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();

  if (value === '') {
    setError(emailInput, emailError, 'Email is required.');
    return false;
  }

  if (!emailRegex.test(value)) {
    setError(emailInput, emailError, 'Please enter a valid email address.');
    return false;
  }

  clearError(emailInput, emailError);
  return true;
}

function validatePassword() {
  const value = passInput.value;

  if (value === '') {
    setError(passInput, passError, 'Password is required.');
    return false;
  }

  if (!passRegex.test(value)) {
    setError(
      passInput,
      passError,
      'Min 8 chars with uppercase, lowercase, number & symbol.'
    );
    return false;
  }

  clearError(passInput, passError);
  return true;
}

function validateConfirmPassword() {
  if (confirmInput.value === '') {
    setError(confirmInput, confirmError, 'Please confirm your password.');
    return false;
  }

  if (confirmInput.value !== passInput.value) {
    setError(confirmInput, confirmError, 'Passwords do not match.');
    return false;
  }

  clearError(confirmInput, confirmError);
  return true;
}

function validatePhone() {
  const value = numInput.value.trim();

  if (value === '') {
    setError(numInput, numError, 'Phone number is required.');
    return false;
  }

  if (!phoneRegex.test(value)) {
    setError(numInput, numError, 'Enter a valid 10-digit phone number.');
    return false;
  }

  clearError(numInput, numError);
  return true;
}

function validateDate() {
  if (dateInput.value === '') {
    setError(dateInput, dateError, 'Birth date is required.');
    return false;
  }

  const today = new Date();
  const birth = new Date(dateInput.value);

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 13) {
    setError(dateInput, dateError, 'You must be at least 13 years old.');
    return false;
  }

  clearError(dateInput, dateError);
  return true;
}

function validateRole() {
  if (roleSelect.value === '') {
    setError(roleSelect, roleError, 'Please select a work role.');
    return false;
  }

  clearError(roleSelect, roleError);
  return true;
}

function validateAddress() {
  const value = addressInput.value.trim();

  if (value === '') {
    setError(addressInput, addressError, 'Address is required.');
    return false;
  }

  if (value.length < 10) {
    setError(addressInput, addressError, 'Please enter a complete address.');
    return false;
  }

  clearError(addressInput, addressError);
  return true;
}


userInput.addEventListener('input', () => {
  validateUsername();
  localStorage.setItem("username", userInput.value);
});

emailInput.addEventListener('input', () => {
  validateEmail();
  localStorage.setItem("email", emailInput.value);
});


confirmInput.addEventListener('input', () => {
  validateConfirmPassword();
  localStorage.setItem("confirmPassword", confirmInput.value);
});

numInput.addEventListener('input', () => {
  validatePhone();
  localStorage.setItem("phone", numInput.value);
});
addressInput.addEventListener('input', () => {
  validateAddress();
  localStorage.setItem("address", addressInput.value);
});

dateInput.addEventListener('change', () => {
  validateDate();
  localStorage.setItem("dob", dateInput.value);
});

roleSelect.addEventListener('change', () => {
  validateRole();
  localStorage.setItem("role", roleSelect.value);
});


document.getElementById('register').addEventListener('click', async () => {

  const isValid =
    validateUsername() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirmPassword() &&
    validatePhone() &&
    validateDate() &&
    validateRole() &&
    validateAddress();

  if (!termsCheck.checked) {
    Swal.fire({
      icon: 'warning',
      title: 'Terms Required',
      text: 'Please accept the Terms & Conditions.'
    });
    return;
  }

  if (!isValid) return;

  try {
    const existingUsers = await fetch(API);
    const users = await existingUsers.json();

    const emailExists = users.some(
      user => user.email.toLowerCase() === emailInput.value.trim().toLowerCase()
    );

    if (emailExists) {
      setError(emailInput, emailError, 'This email is already registered.');
      return;
    }

    const userData = {
      username: userInput.value.trim(),
      email: emailInput.value.trim(),
      password: passInput.value,
      phone: numInput.value.trim(),
      dob: dateInput.value,
      gender: document.querySelector('input[name="gender"]:checked').value,
      role: roleSelect.value,
      address: addressInput.value.trim()
    };

    const response = await fetch(API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
        localStorage.removeItem("username");
  localStorage.removeItem("email");
  localStorage.removeItem("password");
  localStorage.removeItem("confirmPassword");
  localStorage.removeItem("phone");
  localStorage.removeItem("dob");
  localStorage.removeItem("role");
  localStorage.removeItem("address");
      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful!',
        text: 'Welcome to Taskflow. Redirecting to login...',
        timer: 2000
      });

      window.location.href = './login.html';
    } else {
      throw new Error('Failed to save data');
    }

  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong while connecting to the server!'
    });
  }
});

const themeToggler = document.getElementById('themeToggler');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';

html.setAttribute('data-bs-theme', savedTheme);

themeIcon.className =
  savedTheme === 'dark'
    ? 'bi bi-sun-fill'
    : 'bi bi-moon-stars-fill';

// Toggle theme
themeToggler.addEventListener('click', () => {

  const currentTheme = html.getAttribute('data-bs-theme');

  const newTheme =
    currentTheme === 'dark'
      ? 'light'
      : 'dark';

  html.setAttribute('data-bs-theme', newTheme);

  localStorage.setItem('theme', newTheme);

  themeIcon.className =
    newTheme === 'dark'
      ? 'bi bi-sun-fill'
      : 'bi bi-moon-stars-fill';
});

