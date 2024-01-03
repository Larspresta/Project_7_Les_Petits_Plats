import { recipes } from "./recipes.js";

const recipeContainer = document.querySelector("[data-recipe-card-container]");
const recipeCard = document.querySelector("[data-recipe-card]");

console.log("here is the recipes array", recipes);

recipes.forEach((recipe) => {
  const card = recipeCard.content.cloneNode(true).children[0];
  const title = card.querySelector("[data-card-title]");
  const time = card.querySelector("[data-card-time]");
  const description = card.querySelector("[data-card-description]");
  title.textContent = recipe.name;
  time.textContent = recipe.time;
  description.textContent = recipe.description;
  recipeContainer.append(card);
});
