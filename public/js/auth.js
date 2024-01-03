const form = document.querySelector("form"),
	emailField = form.querySelector(".email-field"),
	emailInput = emailField.querySelector(".email"),
	passField = form.querySelector(".create-password"),
	passInput = passField.querySelector(".password"),
	rememberMe = form.querySelector(".remember-me"),
	errorMsg = form.querySelector(".error-msg"),
	errorTxt = form.querySelector(".error-text");

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

if (window.location.href.includes("signin")) {
	form.addEventListener("submit", (e) => {
		e.preventDefault(); //preventing form submitting
		checkEmail();

		//calling function on key up
		emailInput.addEventListener("keyup", checkEmail);
		passInput.addEventListener("keyup", createPass);

		if (
			!emailField.classList.contains("invalid") &&
			!passField.classList.contains("invalid")
		) {
			fetch("/user/signin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					emailOrUsername: emailInput.value,
					password: passInput.value,
					rememberMe: rememberMe.checked,
				}),
			})
				.then(async (response) => {
					const data = await response.json();

					if (response.status === 200) {
						window.location.href = "/";
					} else {
						errorMsg.classList.add("invalid");
						errorTxt.innerHTML = data.error;
					}
				})
				.catch((error) => {
					errorMsg.classList.add("invalid");
					errorTxt.innerHTML = error;
				});
		}
	});
} else if (window.location.href.includes("signup")) {
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
			fetch("signup", {
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
				.then(async (response) => {
					const data = await response.json();

					if (response.status === 200) {
						window.location.href = "/";
					} else {
						errorMsg.classList.add("invalid");
						errorTxt.innerHTML = data.error;
					}
				})
				.catch((error) => {
					errorMsg.classList.add("invalid");
					errorTxt.innerHTML = error;
				});
		}
	});
}
