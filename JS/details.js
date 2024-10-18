let inputDataInArray = [];
let strIngredient = [];

// Fetch meal details by ID
async function getYourDetails(id) {
  // Show loading screen
  document.querySelector(".loading").style.display = "flex";

  try {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    let data = await response.json();
    console.log(data);

    inputDataInArray = data.meals || [];
    displayDetails();
  } catch (error) {
    console.error("Failed to fetch meal details:", error);
  } finally {
    // Hide loading screen
    document.querySelector(".loading").style.display = "none";
  }
}

// Display details of meals
function displayDetails() {
  let container = ``;

  inputDataInArray.forEach((meal) => {
    // Collect ingredients dynamically
    strIngredient = [];
    for (let index = 1; index <= 20; index++) {
      const ingredient = meal[`strIngredient${index}`];
      if (ingredient) strIngredient.push(ingredient); // Only add if valid
    }

    container += `
      <div class="col-md-4">
        <div class="inner">
          <img src="${meal.strMealThumb}" alt="" class="w-100 rounded-5" />
          <h2 class="my-3">${meal.strMeal}</h2>
        </div>
      </div>
      <div class="col-md-8">
        <div class="inner">
          <h1 class="fw-bold">Instructions</h1>
          <p class="load">${meal.strInstructions}</p>
          <h3>Area: ${meal.strArea}</h3>
          <h3>Category: ${meal.strCategory}</h3>
          <h3>Recipe:</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${strIngredient
              .map((ing) => `<li class="alert alert-info m-2 p-1">${ing}</li>`)
              .join("")}
          </ul>
          <h3>Tags:</h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${
              meal.strTags
                ? meal.strTags
                    .split(",")
                    .map(
                      (tag) =>
                        `<li class="alert alert-danger m-2 p-1">${tag}</li>`
                    )
                    .join("")
                : "<li>No Tags Available</li>"
            }
          </ul>
          <button class="btn btn-outline-primary px-4 py-2">
            <a href="${
              meal.strSource
            }" target="_blank" rel="noopener noreferrer">Source</a>
          </button>
          <button class="btn btn-outline-danger px-4 py-2">
            <a href="${
              meal.strYoutube
            }" target="_blank" rel="noopener noreferrer">YouTube</a>
          </button>
        </div>
      </div>`;
  });

  // Append generated HTML to the container
  document.querySelector(".row").innerHTML = container;
}

export { displayDetails, getYourDetails };

// jQuery for fading out the loading screen (if you're using jQuery elsewhere)
jQuery(function () {
  $(".loading").fadeOut(2000, function () {
    $("body").css("overflow", "auto");
  });
});
