"use strict";
var KMJ;
(function (KMJ) {
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    }
    let ingredientCount = 2;
    let currentRecipe = undefined; //vorArbeit für wenn ein rezept bearbeitet oder angezeigt werden soll
    if (sessionStorage.viewRecipeID != "") { // angeklicktes/ausgewähltes rezept wird aus der datenbank geladen
        console.log(sessionStorage.viewRecipeId);
        for (let recipe of KMJ.recipes) {
            if (recipe.title == sessionStorage.viewRecipeId) {
                currentRecipe = recipe;
                break;
            }
        }
    }
    if (window.location.href.includes("view")) {
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
    }
    else if (window.location.href.includes("create_edit")) {
        console.log(sessionStorage.editRecipeId);
        if (sessionStorage.editRecipeId != "") { // angeklicktes/ausgewähltes rezept wird aus der datenbank geladen
            console.log(sessionStorage.editRecipeId);
            for (let recipe of KMJ.recipes) {
                if (recipe.title == sessionStorage.editRecipeId) {
                    currentRecipe = recipe;
                    let title = document.getElementById("title");
                    title.value = currentRecipe.title;
                    let duration = document.getElementById("durations");
                    duration.value = currentRecipe.duration;
                    let selectCourse = document.getElementById("select");
                    selectCourse.value = currentRecipe.course;
                    let portion = document.getElementById("portions");
                    portion.value = currentRecipe.portions.toString();
                    /* let title: HTMLInputElement = <HTMLInputElement> document.getElementById("title");
                    title.value = currentRecipe.title;
                    */
                    let directions = document.getElementById("directions");
                    directions.value = currentRecipe.directions;
                    let ingredientCount = currentRecipe.ingredients.length;
                    for (let i = 0; i < ingredientCount; i++) {
                        if (i >= 2) { //es sind immer mindestens 2 lehre ingredient felder auf der seite
                            addIngredientField();
                        }
                        let amountInput = document.getElementById("Amount" + i);
                        amountInput.value = currentRecipe.ingredients[i].amount;
                        let ingredientInput = document.getElementById("IngredientName" + i);
                        ingredientInput.value = currentRecipe.ingredients[i].name;
                    }
                }
            }
        }
        let finishButton = document.getElementById("finishButtonMobile");
        finishButton.addEventListener("click", getRecipeOfForm);
        let plusIngredient = document.getElementById("plusIngredient");
        plusIngredient.addEventListener("click", addIngredientField);
        function getRecipeOfForm() {
            let formdata = new FormData(document.forms[0]);
            let ingredientList = [];
            let i = 0;
            for (let fom of formdata.getAll("Amount")) {
                let newIngredient = { amount: fom.toString(), name: formdata.get("IngredientName" + i).toString() };
                ingredientList[ingredientList.length] = newIngredient;
                i++;
            }
            let newRecipe = { title: formdata.get("recipeTitle").toString(),
                duration: formdata.get("duration").toString(),
                course: formdata.get("selectCourse").toString(),
                portions: Number(formdata.get("portions")),
                directions: formdata.get("directions").toString(),
                author: sessionStorage.user,
                ingredients: ingredientList
            };
            console.log(newRecipe);
            return newRecipe;
        }
        function addIngredientField() {
            let newIngredientAmount = document.createElement("input");
            newIngredientAmount.type = "text";
            newIngredientAmount.className = "amount";
            newIngredientAmount.id = "Amount" + ingredientCount;
            newIngredientAmount.name = "Amount" + ingredientCount;
            newIngredientAmount.placeholder = "Amount";
            let newIngridientName = document.createElement("input");
            newIngridientName.type = "text";
            newIngridientName.className = "ingredient";
            newIngridientName.id = "IngredientName" + ingredientCount;
            newIngridientName.name = "IngredientName" + ingredientCount;
            newIngridientName.placeholder = "Name of Ingredient";
            document.getElementById("ingredients").appendChild(newIngredientAmount);
            document.getElementById("ingredients").appendChild(newIngridientName);
            ingredientCount++;
        }
    }
})(KMJ || (KMJ = {}));
//# sourceMappingURL=viewScript.js.map