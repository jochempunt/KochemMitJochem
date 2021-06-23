"use strict";
var KMJ;
(function (KMJ) {
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    }
    console.log(sessionStorage.viewRecipeId);
    let currentRecipe = undefined;
    for (let recipe of KMJ.recipes) {
        if (recipe.title == sessionStorage.viewRecipeId) {
            currentRecipe = recipe;
            break;
        }
    }
    let title = document.getElementById("Title");
    if (currentRecipe) {
        title.innerText = currentRecipe.title;
    }
    let courseP = document.getElementById("course");
    courseP.className = currentRecipe.course;
    courseP.innerText = currentRecipe.course;
    let durationP = document.getElementById("duration");
    durationP.innerText = currentRecipe.duration;
    let authorP = document.getElementById("author");
    authorP.innerText = "von: " + currentRecipe.author;
    let portions = document.getElementById("portionNumber");
    portions.innerText = "" + currentRecipe.portions;
    let ingredientList = document.getElementById("ingredient-list");
    for (let ingredient of currentRecipe.ingredients) {
        let li = document.createElement("li");
        let emAmount = document.createElement("em");
        emAmount.innerText = ingredient.amount;
        let ingredientTextNode = document.createTextNode(" " + ingredient.name);
        li.appendChild(emAmount);
        li.appendChild(ingredientTextNode);
        ingredientList.appendChild(li);
    }
    let directionP = document.getElementById("direction-paragraph");
    directionP.innerText = currentRecipe.directions;
})(KMJ || (KMJ = {}));
//# sourceMappingURL=viewScript.js.map