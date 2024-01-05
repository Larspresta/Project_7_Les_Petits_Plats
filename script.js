import { recipes } from "./recipes.js";

const recipeContainer = document.querySelector("[data-recipe-card-container]");
const recipeCard = document.querySelector("[data-recipe-card]");
const searchInput = document.querySelector("[data-search]");
const noMatchMessage = document.querySelector(".no-matches");

let searchRecipe = [];

// Listen user input, search and toggle hide
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  if (value.length >= 3) {
    let match = false;
    for (let j = 0; j < searchRecipe.length; j++) {
      const recipe = searchRecipe[j];
      const isVisible =
        recipe.title.toLowerCase().includes(value) ||
        recipe.description.toLowerCase().includes(value) ||
        ingredientSearch(recipe.ingredients, value);
      recipe.element.classList.toggle("hide", !isVisible);
      if (isVisible) {
        match = true;
      }
    }
    noMatchMessage.classList.toggle("hide", match);
  } else {
    for (let j = 0; j < searchRecipe.length; j++) {
      const recipe = searchRecipe[j];
      recipe.element.classList.remove("hide");
    }
  }
});

function ingredientSearch(ingredients, value) {
  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i].toLowerCase();
    if (ingredient.includes(value)) {
      return true;
    }
  }
  return false;
}

// create recipe cards
searchRecipe = recipes.map((recipe) => {
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

// performance test loops
function searchWithNativeLoops(input) {
  let match = false;
  for (let i = 0; i < searchRecipe.length; i++) {
    const recipe = searchRecipe[i];
    const isVisible =
      recipe.title.toLowerCase().includes(input) ||
      recipe.description.toLowerCase().includes(input) ||
      ingredientSearch(recipe.ingredients, input);
    if (isVisible) {
      match = true;
    }
  }
  return match;
}

function searchWithFunctionalProgramming(input) {
  return searchRecipe.some(
    (recipe) =>
      recipe.title.toLowerCase().includes(input) ||
      recipe.description.toLowerCase().includes(input) ||
      recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(input))
  );
}

//performance test

const input = "tahitian raw fish";
const iterations = 100000;

const startTimeNative = performance.now();
for (let i = 0; i < iterations; i++) {
  searchWithNativeLoops(input);
}

const endTimeNative = performance.now();
const timeNative = endTimeNative - startTimeNative;

const startTimefunctional = performance.now();
for (let i = 0; i < iterations; i++) {
  searchWithFunctionalProgramming(input);
}

const endTimeFunctional = performance.now();
const timeFunctional = endTimeFunctional - startTimefunctional;

console.log(`Time taken for native loops: ${timeNative} milliseconds`);
console.log(`Time taken for functional programming: ${timeFunctional} milliseconds`);
