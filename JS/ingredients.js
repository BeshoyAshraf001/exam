// Ensure the functions in details.js are properly exported
// If running in the browser without a bundler, ensure type="module" is used in the HTML script tag.
import * as details from "./details.js";

let inputDataInArray = [];
let newArray = []; // Declare newArray at the top to avoid scope issues

// Dynamically add styles
// const style = document.createElement("style");
// style.textContent = `
//   img, img + .inner { cursor: pointer; }
//   .inner {
//     width: calc(100% - 48px);
//     height: 100%;
//     color: #000;
//     background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5));
//     top: 100%;
//     transition: all 0.5s;
//     border-radius: 32px;
//   }
//   .col-md-3:hover .inner { top: 0; }
// `;
// document.head.appendChild(style);

// Fetch data from the API
async function getDateFromServer() {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    const data = await response.json();
    inputDataInArray = data.meals || [];
    displayDate();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Display the ingredients
function displayDate() {
  const container = inputDataInArray
    .map(
      (element) => `
      <div class="col-md-3">
        <div class="inner">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${element.strIngredient}</h3>
          <p>${limitWords(
            element.strDescription || "No description available",
            20
          )}</p>
        </div>
      </div>`
    )
    .join("");

  const rowElement = document.querySelector(".row");
  if (rowElement) {
    rowElement.innerHTML = container;

    document.querySelectorAll(".col-md-3").forEach((div) => {
      div.addEventListener("click", () => {
        const ingredient = div.querySelector("h3").innerText;
        openCategory(ingredient);
      });
    });
  } else {
    console.error("Container element with class '.row' not found.");
  }
}

// Utility function to limit text to a certain number of words
function limitWords(text, wordLimit) {
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
}

// Fetch and display meals for the selected ingredient
async function openCategory(query) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    newArray = data.meals || [];
    displayMeals();
  } catch (error) {
    console.error("Failed to fetch category data:", error);
  }
}

// Display meals dynamically
function displayMeals() {
  const container = newArray
    .map(
      (meal) => `
      <div class="col-md-3 position-relative overflow-hidden" data-meal="${meal.idMeal}">
        <img src="${meal.strMealThumb}" class="w-100 rounded-5" alt="${meal.strMeal}" />
        <div class="inner position-absolute py-4 px-3">
          <h2>${meal.strMeal}</h2>
        </div>
      </div>`
    )
    .join("");

  const rowElement = document.querySelector(".row");
  if (rowElement) {
    rowElement.innerHTML = container;

    document.querySelectorAll(".col-md-3").forEach((div) => {
      div.addEventListener("click", async () => {
        const mealID = div.getAttribute("data-meal");
        await details.getYourDetails(mealID); // Use correct import alias
        await details.displayDetails(); // Call the appropriate functions
      });
    });
  } else {
    console.error("Container element with class '.row' not found.");
  }
}

// Initialize the app by fetching data
getDateFromServer();
jQuery(function () {
  $(".loading").fadeOut(2000, function () {
    $("body").css("overflow", "auto");
  });
});
