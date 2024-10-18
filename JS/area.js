import * as _ from "./details.js";

let inputDataInArray = [];

// Add CSS styles dynamically
const style = document.createElement("style");
style.textContent = `
  img, img + .inner {
    cursor: pointer;
  }
  .inner {
    width: calc(100% - 24*2px);
    height: 100%;
    color: #000;
    background-image: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    );
    top: 100%;
    transition: all 0.5s;
    border-radius: 32px;
  }
  .col-md-3:hover .inner {
    top: 0;
  }
`;
document.head.appendChild(style);

async function getDateFromServer() {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    inputDataInArray = data.meals || []; // Access the 'meals' array correctly
    displayDate();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

getDateFromServer();

function displayDate() {
  let container = ``;
  inputDataInArray.forEach((element) => {
    container += `
      <div class="col-md-3">
        <div class="inner">
          <i class="fa-solid fa-house-laptop fs-1"></i>
          <h2>${element.strArea}</h2>
        </div>
      </div>`;
  });

  const rowElement = document.querySelector(".row");
  if (rowElement) {
    rowElement.innerHTML = container;

    // Attach click event to each area element
    document.querySelectorAll(".col-md-3").forEach((div) => {
      div.addEventListener("click", () => {
        const area = div.querySelector("h2").innerText; // Get area from inner text
        openCategory(area);
      });
    });
  } else {
    console.error("Container element with class '.row' not found.");
  }
}

let newArray = [];

async function openCategory(query) {
  // Show loading screen
  document.querySelector(".loading").style.display = "flex";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${query}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    newArray = data.meals || [];
    console.log(newArray);
    displayMeals();
  } catch (error) {
    console.error("Failed to fetch category data:", error);
  } finally {
    // Hide loading screen
    document.querySelector(".loading").style.display = "none";
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
          // Show loading screen
          document.querySelector(".loading").style.display = "flex";

          // Remove existing style if present
          const existingStyle = document.querySelector("#meal-detail-style");
          if (existingStyle) {
            existingStyle.remove();
          }

          await _.getYourDetails(mealID);
          await _.displayDetails();
          const style = document.createElement("style");
          style.id = "meal-detail-style"; // Set an ID for easy reference
          style.textContent = `
              .inner {
                  background-image: none;
                  color: #fff;
                  background-color: #0d0d0d;
              }
          `;
          document.head.appendChild(style);

          // Hide loading screen
          document.querySelector(".loading").style.display = "none";
        })();

        // location.href = "details.html"; // Uncomment if needed
      });
    });
  } else {
    console.error("Container element with class '.row' not found.");
  }
}
getDateFromServer();
jQuery(function () {
  $(".loading").fadeOut(2000, function () {
    $("body").css("overflow", "auto");
  });
});
