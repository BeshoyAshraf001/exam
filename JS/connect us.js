const form = document.getElementById("contact-form");
const inputs = Array.from(form.querySelectorAll("input"));
const errorMessages = form.querySelectorAll("p.text-danger");
const submitButton = form.querySelector("button[type='submit']");

const regexPatterns = {
  firstName: /^[A-Z][a-zA-Z]{1,}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  age: /^(1[01]?|[1-9]?[0-9])$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
};

// Validate input function
function validateInput(input) {
  const regex = regexPatterns[input.name];
  if (!regex) {
    console.error(`No regex pattern defined for ${input.name}`);
    return false;
  }

  const isValid = regex.test(input.value);
  const errorMessage = input.nextElementSibling;

  // Show or hide the error message based on the validation result
  errorMessage.classList.toggle("d-none", isValid);
  return isValid;
}

// Check if all inputs are valid
function checkFormValidity() {
  const isFormValid = inputs.every((input) => validateInput(input));
  submitButton.disabled = !isFormValid;
}

// Attach focusout event listeners to all inputs
inputs.forEach((input) => {
  input.addEventListener("focusout", () => {
    validateInput(input);
    checkFormValidity();
  });
});

// Validate password match
const passwordInput = form.querySelector("#password");
const rePasswordInput = form.querySelector("#re-password");

rePasswordInput.addEventListener("focusout", () => {
  const passwordsMatch = passwordInput.value === rePasswordInput.value;
  const errorMessage = rePasswordInput.nextElementSibling;

  // Show or hide the error message based on password match
  errorMessage.classList.toggle("d-none", passwordsMatch);
  checkFormValidity();
});
jQuery(function () {
  $(".loading").fadeOut(2000, function () {
    $("body").css("overflow", "auto");
  });
});
