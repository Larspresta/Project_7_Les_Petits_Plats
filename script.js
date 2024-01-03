import { recipes } from "./recipes.js";

const recipeContainer = document.querySelector("[data-recipe-card-container]");
const recipeCard = document.querySelector("[data-recipe-card]");
const searchInput = document.querySelector("[data-search]");

searchInput.addEventListener("input", (e) => {
  const value = e.target.value;
  console.log(value);
});

console.log("here is the recipes array", recipes);

recipes.forEach((recipe) => {
  const card = recipeCard.content.cloneNode(true).children[0];
  const title = card.querySelector("[data-card-title]");
  const time = card.querySelector("[data-card-time]");
  const description = card.querySelector("[data-card-description]");
  const ingredients = card.querySelector("[data-card-ingredients]");
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
    ingredients.appendChild(ingredientItem);
  });

  recipeContainer.append(card);
});
