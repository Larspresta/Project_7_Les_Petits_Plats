import { recipes } from "./recipes.js";
console.log("here is the recipes array", recipes);

const recipeContainer = document.querySelector("[data-recipe-card-container]");
const recipeCard = document.querySelector("[data-recipe-card]");
const searchInput = document.querySelector("[data-search]");
const noMatchMessage = document.querySelector(".no-matches");

let recipeCardItems = [];

// Listen user input, search and toggle hide
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  if (value.length >= 3) {
    let match = false;
    recipeCardItems.forEach((recipe) => {
      console.log(recipeCardItems);
      const isVisible =
        recipe.title.toLowerCase().includes(value) ||
        recipe.description.toLowerCase().includes(value) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(value));
      recipe.element.classList.toggle("hide", !isVisible);
      if (isVisible) {
        match = true;
      }
    });
    noMatchMessage.classList.toggle("hide", match);
  } else {
    recipeCardItems.forEach((recipe) => recipe.element.classList.remove("hide"));
  }
});

// create recipe cards
recipeCardItems = recipes.map((recipe) => {
  const card = recipeCard.content.cloneNode(true).children[0];
  const title = card.querySelector("[data-card-title]");
  const time = card.querySelector("[data-card-time]");
  const description = card.querySelector("[data-card-description]");
  const ingredientList = card.querySelector("[data-card-ingredients]");
  title.textContent = recipe.name;
  time.textContent = recipe.time;
  description.textContent = recipe.description;

  recipe.ingredients.forEach((ingredient) => {
    const ingredientItem = document.createElement("li");

    const ingredientItemName = document.createElement("span");
    ingredientItemName.classList.add("fw-bold");
    const ingredientValueUnit = document.createElement("span");

    ingredientItemName.textContent = `${ingredient.ingredient}:`;

    ingredientValueUnit.textContent = ` ${ingredient.quantity || ""} ${ingredient.unit || ""}`;

    ingredientItem.appendChild(ingredientItemName);
    ingredientItem.appendChild(ingredientValueUnit);
    ingredientList.appendChild(ingredientItem);
  });

  recipeContainer.append(card);

  const ingredientNames = recipe.ingredients.map((ingredient) => ingredient.ingredient);

  return {
    title: recipe.name,
    description: recipe.description,
    ingredients: ingredientNames,
    element: card,
  };
});

function getUniqueValues(recipes, key) {
  const valuesSet = new Set();

  recipes.forEach((recipe, index) => {
    if (key in recipe) {
      const keyValue = recipe[key];

      if (Array.isArray(keyValue)) {
        keyValue.forEach((value, subIndex) => {
          if (typeof value === "object" && "ingredient" in value) {
            // For ingredients, extract the 'ingredient' property
            valuesSet.add(value.ingredient.toLowerCase());
          } else if (typeof value === "string") {
            // For other cases, add the value directly
            valuesSet.add(value.toLowerCase());
          } else {
            console.error(
              `Unsupported value found in array at recipe index ${index}, sub-index ${subIndex} for key '${key}':`,
              value
            );
          }
        });
      } else if (typeof keyValue === "string") {
        // Handle the case where the key value is a string
        valuesSet.add(keyValue.toLowerCase());
      } else {
        console.error(
          `Unsupported value found at recipe index ${index} for key '${key}':`,
          keyValue
        );
      }
    }
  });

  return Array.from(valuesSet);
}

const uniqueAppliances = getUniqueValues(recipes, "appliance");
const uniqueIngredients = getUniqueValues(recipes, "ingredients");
const uniqueUstensils = getUniqueValues(recipes, "ustensils");
console.log("Appliances:", uniqueAppliances);
console.log("unique ingredients", uniqueIngredients);
console.log("unique ustensils", uniqueUstensils);

//populate dropdown <ul>

// add list items from the array
