import * as _ from "./details.js";
let inputDataInArray = [];

async function getCategoriesFromServer() {
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/categories.php`
    );
    let data = await response.json();
    console.log(data);
    inputDataInArray = data.categories || [];
    displayCategories();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
}

function displayCategories() {
  let container = ``;

  inputDataInArray.forEach((element) => {
    let description =
      element.strCategoryDescription.split(" ").slice(0, 12).join(" ") +
      (element.strCategoryDescription.split(" ").length > 12 ? "..." : "");

    container += `
      <div class="col-md-3 position-relative overflow-hidden category" data-category="${element.strCategory}">
        <img src="${element.strCategoryThumb}" class="w-100 rounded-5" alt="${element.strCategory}" />
        <div class="inner position-absolute py-4 px-3 overflow-hidden">
          <h2>${element.strCategory}</h2>
          <p>${description}</p>
        </div>
      </div>`;
  });

  const rowElement = document.querySelector(".row");
  if (rowElement) {
    rowElement.innerHTML = container;

    // Attach click event to each category element
    document.querySelectorAll(".category").forEach((div) => {
      div.addEventListener("click", () => {
        const category = div.getAttribute("data-category");
        openCategory(category);
      });
    });
  } else {
    console.error("Container element with class '.row' not found.");
  }
}

getCategoriesFromServer();

let newArray = [];

async function openCategory(query) {
  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${query}`
    );
    let data = await response.json();
    newArray = data.meals || [];
    console.log(newArray);
    displayMeals();
  } catch (error) {
    console.error("Failed to fetch category data:", error);
  }
}

function displayMeals() {
  let container = ``;

  newArray.forEach((meal) => {
    container += `
    <div class="col-md-3 position-relative overflow-hidden" data-meal="${meal.idMeal}">
      <img src="${meal.strMealThumb}" class="w-100 rounded-5" alt="${meal.strMeal}" />
      <div class="inner position-absolute py-4 px-3">
        <h2>${meal.strMeal}</h2>
      </div>
    </div>`;
  });

  const rowElement = document.querySelector(".row");
  if (rowElement) {
    rowElement.innerHTML = container;

    // Attach click event to each meal element
    document.querySelectorAll(".col-md-3").forEach((div) => {
      div.addEventListener("click", () => {
        const mealID = div.getAttribute("data-meal");

        (async () => {
          await _.getYourDetails(mealID);
          await _.displayDetails();
          const style = document.createElement("style");
          style.textContent = `
              .inner {
                  background-image: none;
                  color: #fff;
                  background-color: #0d0d0d;
              }
          `;
          document.head.appendChild(style);
        })();

        // location.href = "details.html"; // Uncomment if needed
      });
    });
  } else {
    console.error("Container element with class '.row' not found.");
  }
}
jQuery(function () {
  $(".loading").fadeOut(2000, function () {
    $("body").css("overflow", "auto");
  });
});
