const form = document.querySelector("form"),
  emailField = form.querySelector(".email-field"),
  emailInput = emailField.querySelector(".email"),
  passField = form.querySelector(".create-password"),
  passInput = passField.querySelector(".password"),
  rememberMe = form.querySelector(".remember-me");

// Email Validtion
function checkEmail() {
  const emaiPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailInput.value.match(emaiPattern)) {
    return emailField.classList.add("invalid"); //adding invalid class if email value do not mathced with email pattern
  }
  emailField.classList.remove("invalid"); //removing invalid class if email value matched with emaiPattern
}

function createPass() {
  const passPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passInput.value.match(passPattern)) {
    return passField.classList.add("invalid"); //adding invalid class if password input value do not match with passPattern
  }
  passField.classList.remove("invalid"); //removing invalid class if password input value matched with passPattern
}

// Hide and show password
const eyeIcons = document.querySelectorAll(".show-hide");

eyeIcons.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    const pInput = eyeIcon.parentElement.querySelector("input"); //getting parent element of eye icon and selecting the password input
    if (pInput.type === "password") {
      eyeIcon.classList.replace("bx-hide", "bx-show");
      return (pInput.type = "text");
    }
    eyeIcon.classList.replace("bx-show", "bx-hide");
    pInput.type = "password";
  });
});
const errorMsg = document.querySelector(".error-msg");
const errorTxt = document.getElementById("error-text");
if (window.location.href.includes("signin")) {
  const url = window.location.href.includes("designer")
    ? "/api/designer/signin"
    : "/api/user/signin";

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); //preventing form submitting
    checkEmail();

    //calling function on key up
    emailInput.addEventListener("keyup", checkEmail);
    passInput.addEventListener("keyup", createPass);

    if (!emailField.classList.contains("invalid")) {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value,
          password: passInput.value,
          rememberMe: rememberMe.checked,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            window.location.href = "/";
            location.reload();
          }
          return response.json();
        })
        .then((data) => {
          errorMsg.classList.add("invalid");
          errorTxt.innerHTML = data.error;
        })
        .catch((error) => {
          console.log(error);
          errorMsg.classList.add("invalid");
          errorTxt.innerHTML = error.message;
        });
    }
  });
} else if (
  window.location.href.includes("signup") &&
  !window.location.href.includes("designer")
) {
  // Confirm Password Validtion
  function confirmPass() {
    if (passInput.value !== cPassInput.value || cPassInput.value === "") {
      return cPassField.classList.add("invalid");
    }
    cPassField.classList.remove("invalid");
  }
  const cPassField = form.querySelector(".confirm-password"),
    cPassInput = cPassField.querySelector(".cPassword"),
    username = form.querySelector(".username"),
    firstname = form.querySelector(".first-name"),
    lastname = form.querySelector(".last-name");

  const phoneInputField = form.querySelector("#phone");

  // Initialize intlTelInput
  const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "auto",
    geoIpLookup: (callback) => {
      fetch("https://ipapi.co/json")
        .then((res) => res.json())
        .then((data) => callback(data.country_code))
        .catch(() => callback("us"));
    },
    nationalMode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  // Calling Funtion on Form Sumbit
  form.addEventListener("submit", (e) => {
    e.preventDefault(); //preventing form submitting
    checkEmail();
    createPass();
    confirmPass();

    //calling function on key up
    emailInput.addEventListener("keyup", checkEmail);
    passInput.addEventListener("keyup", createPass);
    cPassInput.addEventListener("keyup", confirmPass);
    if (
      !emailField.classList.contains("invalid") &&
      !passField.classList.contains("invalid") &&
      !cPassField.classList.contains("invalid")
    ) {
      fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value,
          password: passInput.value,
          username: username.value,
          firstname: firstname.value,
          lastname: lastname.value,
          confirmPassword: cPassInput.value,
          phoneNumber: phoneInputField.value,
          countryCode: phoneInput.getSelectedCountryData().dialCode,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            window.location.href = "/";
            location.reload();
          }
          return response.json();
        })
        .then((data) => {
          errorMsg.classList.add("invalid");
          errorTxt.innerHTML = data.error;
        })
        .catch((error) => {
          console.log(error);
          errorMsg.classList.add("invalid");
          errorTxt.innerHTML = error.message;
        });
    }
  });
} else if (window.location.href.includes("designer/signup")) {
  // Confirm Password Validtion
  function confirmPass() {
    if (passInput.value !== cPassInput.value || cPassInput.value === "") {
      return cPassField.classList.add("invalid");
    }
    cPassField.classList.remove("invalid");
  }
  const cPassField = form.querySelector(".confirm-password"),
    cPassInput = cPassField.querySelector(".cPassword"),
    name = form.querySelector(".name"),
    description = form.querySelector(".description"),
    logo = document.getElementById("logo");

  const phoneInputField = form.querySelector("#phone");
  // Initialize intlTelInput
  const phoneInput = window.intlTelInput(phoneInputField, {
    initialCountry: "auto",
    geoIpLookup: (callback) => {
      fetch("https://ipapi.co/json")
        .then((res) => res.json())
        .then((data) => callback(data.country_code))
        .catch(() => callback("us"));
    },
    nationalMode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  // Calling Funtion on Form Sumbit
  form.addEventListener("submit", (e) => {
    e.preventDefault(); //preventing form submitting
    checkEmail();
    createPass();
    confirmPass();

    //calling function on key up
    emailInput.addEventListener("keyup", checkEmail);
    passInput.addEventListener("keyup", createPass);
    cPassInput.addEventListener("keyup", confirmPass);
    if (
      !emailField.classList.contains("invalid") &&
      !passField.classList.contains("invalid") &&
      !cPassField.classList.contains("invalid")
    ) {
      const signupForm = document.getElementById("signupForm");

      if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
          event.preventDefault();

          // Get form data
          const formData = new FormData(signupForm);
          formData.append(
            "countryCode",
            phoneInput.getSelectedCountryData().dialCode
          );

          try {
            const response = await fetch("/api/designer/signup", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();

              if (response.status === 200) {
                window.location.href = "/";
              } else {
                errorMsg.classList.add("invalid");
                errorTxt.innerHTML = data.error;
              }
            }
          } catch (error) {
            errorMsg.classList.add("invalid");
            errorTxt.innerHTML = error;
          }
        });
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the current URL
  const currentURL = window.location.pathname;

  // Check if the URL contains "/designer/signin"
  if (currentURL.includes("/designer")) {
    if (currentURL.includes("/signin")) {
      // If the URL matches, hide the "Login with Google" button
      const googleButton = document.querySelector(".google");
      const line = document.querySelector(".line");
      const signupLink = document.querySelector(".signup-link");
      const forgotPassword = document.querySelector(".forgot-pass");
      if (googleButton) {
        googleButton.style.display = "none";
      }
      if (line) {
        line.style.display = "none";
      }
      if (signupLink) {
        signupLink.href = "/designer/signup";
      }
      if (forgotPassword) {
        forgotPassword.href = "/designer/forgotPassword";
      }
    } else if (currentURL.includes("/signup")) {
      const googleButton = document.querySelector(".google");
      const line = document.querySelector(".line");
      const username = document.querySelector(".username");
      const lastname = document.querySelector(".last-name");
      const firstname = document.querySelector(".first-name");
      const loginLink = document.querySelector(".login-link");

      if (googleButton) {
        googleButton.remove();
      }
      if (line) {
        line.remove();
      }
      if (username) {
        username.remove();
      }
      if (lastname) {
        lastname.remove();
      }
      if (firstname) {
        firstname.remove();
      }
      if (loginLink) {
        loginLink.href = "/designer/signin";
      }
    }
  } else if (
    currentURL.includes("/signup") &&
    !currentURL.includes("/designer")
  ) {
    const name = document.querySelector(".name");
    const description = document.querySelector(".description");
    const logo = document.getElementById("logo");
    const logoLabel = document.querySelector(".logo-label");
    const loginLink = document.querySelector(".login-link");
    if (name) {
      name.remove();
    }
    if (description) {
      description.remove();
    }
    if (logo) {
      logo.remove();
    }
    if (logoLabel) {
      logoLabel.remove();
    }
    if (loginLink) {
      loginLink.href = "/signin";
    }
  } else if (currentURL.includes("/signin")) {
    const signupLink = document.querySelector(".signup-link");
    const forgotPassword = document.querySelector(".forgot-pass");
    if (signupLink) {
      signupLink.href = "/signup";
    }
    if (forgotPassword) {
      forgotPassword.href = "/forgotPassword";
    }
  }
});

