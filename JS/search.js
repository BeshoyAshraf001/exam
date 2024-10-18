import * as _ from "./details.js";
const searchInputByName = document.querySelector(
  "input[placeholder='search By Name']"
);
const searchByFirstLetter = document.querySelector(
  "input[placeholder='Search By First Letter']"
);
let inputDataInArray = [];
async function getDateFromServerName(Qauary) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${Qauary}`
    );
    const data = await response.json();
    inputDataInArray = data.meals || [];
    displayDate();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
function displayDate() {
  let container = ``;
  inputDataInArray.forEach((element) => {
    container += `
        <div class="col-md-3 position-relative overflow-hidden">
          <img src="${element.strMealThumb}" class="w-100 rounded-5" alt="${element.strMeal}" />
          <div class="inner position-absolute py-4 px-3">
            <h2>${element.strMeal}</h2>
          </div>
        </div>`;
  });

  document.querySelector(".display").innerHTML = container;
}

searchInputByName.addEventListener("input", (e) => {
  getDateFromServerName(searchInputByName.value);
});
jQuery(function () {
  $(".loading").fadeOut(2000, function () {
    $("body").css("overflow", "auto");
  });
});
