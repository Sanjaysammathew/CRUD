const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    
    const emailError = document.querySelector(".invalid-email");
    const passError = document.querySelector(".invalid-password");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); 
      
      let isValid = true;

      // Validate Email
      if (!emailRegex.test(emailInput.value.trim())) {
        emailError.innerText = "Please enter a valid email address.";
        emailInput.style.borderColor = "#dc3545";
        isValid = false;
      } else {
        emailError.innerText = "";
        emailInput.style.borderColor = "";
      }

      // Validate Password
      if (!passRegex.test(passwordInput.value)) {
        passError.innerText = "Requires 8+ chars, 1 uppercase, 1 number & 1 symbol.";
        passwordInput.style.borderColor = "#dc3545";
        isValid = false;
      } else {
        passError.innerText = "";
        passwordInput.style.borderColor = "";
      }

      if (isValid) {

  try {

    const response = await fetch("http://localhost:3000/users");

    const users = await response.json();

    const validUser = users.find((user) =>
      user.email === emailInput.value.trim() &&
      user.password === passwordInput.value
    );

    if (validUser) {

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome to TaskFlow!",
        timer: 2000
      });

      loginForm.reset();

      window.location.href = "./index.html";

    } else {

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password"
      });

    }

  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "Server Error",
      text: "Unable to connect to database"
    });

    console.log(error);

  }

}
    });

    // --- THEME TOGGLE LOGIC ---
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