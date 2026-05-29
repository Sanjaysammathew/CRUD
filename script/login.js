const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

const loginForm = $("#loginForm");
const emailInput = $("#email");
const passwordInput = $("#password");

const emailError = $(".invalid-email");
const passError = $(".invalid-password");

loginForm.on("submit", async function (e) {

  e.preventDefault();

  let isValid = true;

  // Validate Email
  if (!emailRegex.test(emailInput.val().trim())) {

    emailError.text("Please enter a valid email address.");
    emailInput.css("borderColor", "#dc3545");

    isValid = false;

  } else {

    emailError.text("");
    emailInput.css("borderColor", "");

  }

  // Validate Password
  if (!passRegex.test(passwordInput.val())) {

    passError.text("Requires 8+ chars, 1 uppercase, 1 number & 1 symbol.");
    passwordInput.css("borderColor", "#dc3545");

    isValid = false;

  } else {

    passError.text("");
    passwordInput.css("borderColor", "");

  }

  if (isValid) {

    try {

      const response = await fetch("http://localhost:3000/users");

      const users = await response.json();

      const validUser = users.find((user) =>
        user.email === emailInput.val().trim() &&
        user.password === passwordInput.val()
      );

      if (validUser) {

          localStorage.setItem("loggedInUser", JSON.stringify(validUser));

        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome to TaskFlow!",
          timer: 2000
        });

        loginForm[0].reset();

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

const themeToggler = $("#themeToggler");
const themeIcon = $("#themeIcon");
const html = $("html");

// Load saved theme when page opens
const savedTheme = localStorage.getItem("theme") || "dark";

html.attr("data-bs-theme", savedTheme);

if (savedTheme === "light") {
    themeIcon
        .removeClass("bi-sun-fill")
        .addClass("bi-moon-stars-fill");
} else {
    themeIcon
        .removeClass("bi-moon-stars-fill")
        .addClass("bi-sun-fill");
}

// Toggle Theme
themeToggler.on("click", function () {

    const currentTheme = html.attr("data-bs-theme");

    if (currentTheme === "light") {

        html.attr("data-bs-theme", "dark");

        themeIcon
            .removeClass("bi-moon-stars-fill")
            .addClass("bi-sun-fill");

        localStorage.setItem("theme", "dark");

    } else {

        html.attr("data-bs-theme", "light");

        themeIcon
            .removeClass("bi-sun-fill")
            .addClass("bi-moon-stars-fill");

        localStorage.setItem("theme", "light");
    }

});

