import { recipes } from "./recipes.js";
const recipeContainer = document.querySelector("[data-recipe-card-container]");
const recipeCard = document.querySelector("[data-recipe-card]");
const searchInput = document.querySelector("[data-search]");
const noMatchMessage = document.querySelector(".no-matches");

let recipeCardItems = [];

let selectedTags = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
};

// Main search. Listen user input, search and toggle hide
searchInput.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  if (value.length >= 3) {
    let match = false;
    let filteredRecipes = [];
    recipeCardItems.forEach((recipe) => {
      const isVisible =
        recipe.title.toLowerCase().includes(value) ||
        recipe.description.toLowerCase().includes(value) ||
        recipe.ingredients.some((ingredient) => ingredient.toLowerCase().includes(value));
      recipe.element.classList.toggle("hide", !isVisible);
      if (isVisible) {
        match = true;
        filteredRecipes.push(recipe);
      }
    });
    filterDropdownItems(filteredRecipes);
    noMatchMessage.classList.toggle("hide", match);
  } else {
    recipeCardItems.forEach((recipe) => recipe.element.classList.remove("hide"));
    populateDropdown("ingredients-dropdown", uniqueIngredients);
    populateDropdown("appliances-dropdown", uniqueAppliances);
    populateDropdown("ustensils-dropdown", uniqueUstensils);
  }
});

function filterDropdownItems(filteredRecipes) {
  const filteredIngredients = new Set();
  const filteredAppliances = new Set();
  const filteredUstensils = new Set();

  filteredRecipes.forEach((recipe) => {
    // Filter Ingredients
    recipe.ingredients.forEach((ingredient) => {
      filteredIngredients.add(ingredient.toLowerCase());
    });

    // Filter Appliances
    if (recipe.appliance) {
      filteredAppliances.add(recipe.appliance.toLowerCase());
    }

    // Filter Utensils
    if (recipe.ustensils && Array.isArray(recipe.ustensils)) {
      recipe.ustensils.forEach((ustensil) => filteredUstensils.add(ustensil.toLowerCase()));
    }
  });

  populateDropdown("ingredients-dropdown", Array.from(filteredIngredients));
  populateDropdown("appliances-dropdown", Array.from(filteredAppliances));
  populateDropdown("ustensils-dropdown", Array.from(filteredUstensils));

  console.log("Filtered Recipes:", filteredRecipes);
}

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

  const ingredientNames = recipe.ingredients.map((ingredient) =>
    ingredient.ingredient.toLowerCase()
  );

  return {
    title: recipe.name,
    description: recipe.description,
    ingredients: ingredientNames,
    appliance: recipe.appliance ? recipe.appliance.toLowerCase() : "",
    ustensils: recipe.ustensils ? recipe.ustensils.map((u) => u.toLowerCase()) : [],
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
            valuesSet.add(value.ingredient.toLowerCase());
          } else if (typeof value === "string") {
            valuesSet.add(value.toLowerCase());
          } else {
            console.error(
              `Unsupported value found in array at recipe index ${index}, sub-index ${subIndex} for key '${key}':`,
              value
            );
          }
        });
      } else if (typeof keyValue === "string") {
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
function populateDropdown(ulId, items) {
  const dropdown = document.getElementById(ulId);
  const input = dropdown.querySelector(".filter-input");
  const list = dropdown.querySelector("ul");
  list.innerHTML = "";
  const tags = document.querySelector(".tags");
  list.classList.add("list-unstyled", "py-4", "my-2", "col-12");

  // Add list items from the array
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    listItem.classList.add("dropdown-item");
    listItem.dataset.array = ulId;
    listItem.addEventListener("click", () => {
      const tag = document.createElement("li");
      const icon = document.createElement("img");
      icon.src = "assets/x-circle.svg";
      tag.classList.add(ulId, "rounded-3", "mx-2", "list-group-item");
      tag.textContent = item;
      tag.appendChild(icon);
      tags.appendChild(tag);

      const tagType = ulId.split("-")[0];
      selectedTags[tagType].add(item.toLowerCase());
      updateRecipeDisplay();

      icon.addEventListener("click", () => {
        tag.remove();
        const tagType = ulId.split("-")[0];
        selectedTags[tagType].delete(item.toLowerCase());
        updateRecipeDisplay();
      });
    });
    list.appendChild(listItem);
  });

  dropdown.appendChild(list);

  list.style.top = input.offsetHeight + "px";

  const chevron = dropdown.querySelector("img");

  // Toggle the 'show' class on the list when the chevron is clicked or input focus
  chevron.addEventListener("click", () => {
    list.classList.toggle("show");
    dropdown.classList.toggle("col-5", list.classList.contains("show"));
  });

  input.addEventListener("focus", () => {
    list.classList.toggle("show");
    dropdown.classList.toggle("col-5", list.classList.contains("show"));
  });
}

function updateRecipeDisplay() {
  recipeCardItems.forEach((recipe) => {
    const matchesIngredients =
      selectedTags.ingredients.size === 0 ||
      Array.from(selectedTags.ingredients).every((tag) => recipe.ingredients.includes(tag));

    const matchesAppliances =
      selectedTags.appliances.size === 0 || selectedTags.appliances.has(recipe.appliance);

    const matchesUstensils =
      selectedTags.ustensils.size === 0 ||
      Array.from(selectedTags.ustensils).every((tag) => recipe.ustensils.includes(tag));

    const shouldDisplay = matchesIngredients && matchesAppliances && matchesUstensils;
    recipe.element.classList.toggle("hide", !shouldDisplay);
  });
}

populateDropdown("ingredients-dropdown", uniqueIngredients);
populateDropdown("appliances-dropdown", uniqueAppliances);
populateDropdown("ustensils-dropdown", uniqueUstensils);

document.getElementById("filter-ingredients").addEventListener("input", (e) => {
  filterDropdownItemsBySearch("ingredients-dropdown", uniqueIngredients, e.target.value);
});

document.getElementById("filter-appliances").addEventListener("input", (e) => {
  filterDropdownItemsBySearch("appliances-dropdown", uniqueAppliances, e.target.value);
});

document.getElementById("filter-ustensils").addEventListener("input", (e) => {
  filterDropdownItemsBySearch("ustensils-dropdown", uniqueUstensils, e.target.value);
});

function filterDropdownItemsBySearch(dropdownId, items, searchText) {
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(searchText.toLowerCase())
  );
  populateDropdown(dropdownId, filteredItems);
}
