import * as _ from "./details.js";

//#region =========================|> nav left <|=========================
const navWidth = document.querySelector(".nav_hide").offsetWidth; // Get width

document.querySelector(".left_nav").style.left = `-${navWidth}px`;
let isShow = false;

document.querySelectorAll(".fa-x, .fa-bars").forEach((icon) => {
  icon.addEventListener("click", () => {
    if (isShow) {
      document.querySelector(".left_nav").style.transition = "left 1s";
      document.querySelector(".left_nav").style.left = `-${navWidth}px`;
      toggleIcons();
      $(".links li").animate({ top: "300px" }, 500);

      isShow = false;
    } else {
      document.querySelector(".left_nav").style.transition = "left 1s";
      document.querySelector(".left_nav").style.left = "0px";
      toggleIcons();

      // $(".links li").animate({ top: "300px" }, 500);
      for (let index = 0; index < 5; index++) {
        $(".links li")
          .eq(index)
          .animate({ top: "0" }, (index + 5) * 100);
      }
      isShow = true;
    }
  });
});

function toggleIcons() {
  document.querySelectorAll(".fa-x, .fa-bars").forEach((icon) => {
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-x");
  });
}

//#endregion
// Fetch data and display meals
let inputDataInArray = [];

async function getDateFromServer(Query = "search") {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/${Query}.php?s`
    );
    const data = await response.json();
    inputDataInArray = data.meals || []; // Fix: Access the 'meals' array
    displayDate();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayDate() {
  let container = ``;
  let mealIds = []; // Array to store meal IDs

  inputDataInArray.forEach((element) => {
    container += `
      <div class="col-md-3 position-relative overflow-hidden" data-meal="${element.idMeal}">
        <img src="${element.strMealThumb}" class="w-100 rounded-5" alt="${element.strMeal}" />
        <div class="inner position-absolute py-4 px-3">
          <h2>${element.strMeal}</h2>
        </div>
      </div>`;

    // Collecting meal IDs
    mealIds.push(element.idMeal); // Add the meal ID to the array
  });

  document.querySelector(".row").innerHTML = container;

  // Log all meal IDs to the console

  document.querySelectorAll(".col-md-3").forEach((div) => {
    div.addEventListener("click", () => {
      const mealID = div.getAttribute("data-meal");

      (async (params) => {
        await _.getYourDetails(mealID);
        await _.displayDetails();
        const style = document.createElement("style");
        // Add CSS rules as text content
        style.textContent = `
            .inner {
                background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
                color: #fff;
                background-color: #0d0d0d;
            }
        `;
        document.head.appendChild(style);
      })();

      // location.href = "details.html";
    });
  });
}
getDateFromServer();
