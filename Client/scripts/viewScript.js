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
        for (let i = 0; i < currentRecipe.ingredientAmounts.length; i++) {
            let li = document.createElement("li");
            let emAmount = document.createElement("em");
            emAmount.innerText = currentRecipe.ingredientAmounts[i];
            let ingredientTextNode = document.createTextNode(" " + currentRecipe.ingredientNames[i]);
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
                    let directions = document.getElementById("directions");
                    directions.value = currentRecipe.directions;
                    let ingredientCount = currentRecipe.ingredientAmounts.length;
                    for (let i = 0; i < ingredientCount; i++) {
                        if (i >= 2) { //es sind immer mindestens 2 lehre ingredient felder auf der seite
                            addIngredientField();
                        }
                        let amountInput = document.getElementById("Amount" + i);
                        amountInput.value = currentRecipe.ingredientAmounts[i];
                        //amountInput.value = currentRecipe.ingredients[i].amount;
                        let ingredientInput = document.getElementById("IngredientName" + i);
                        ingredientInput.value = currentRecipe.ingredientNames[i];
                        // ingredientInput.value = currentRecipe.ingredients[i].name;
                    }
                }
            }
        }
        let finishButton = document.getElementById("finishButtonMobile");
        finishButton.addEventListener("click", getRecipeOfForm);
        let plusIngredient = document.getElementById("plusIngredient");
        plusIngredient.addEventListener("click", addIngredientField);
        async function getRecipeOfForm() {
            let formdata = new FormData(document.forms[0]);
            let ingredientNamelist = [];
            let ingredientAmountlist = [];
            let i = 0;
            for (let fom of formdata.getAll("Amount")) {
                let ingedientAmount = fom.toString();
                let ingredientName = formdata.get("IngredientName" + i).toString();
                ingredientAmountlist[ingredientAmountlist.length] = ingedientAmount;
                ingredientNamelist[ingredientNamelist.length] = ingredientName;
                i++;
            }
            let newRecipe = { title: formdata.get("recipeTitle").toString(),
                duration: formdata.get("duration").toString(),
                course: formdata.get("selectCourse").toString(),
                portions: Number(formdata.get("portions")),
                directions: formdata.get("directions").toString(),
                author: sessionStorage.user,
                ingredientAmounts: ingredientAmountlist,
                ingredientNames: ingredientNamelist
            };
            console.log(newRecipe);
            //.............................//
            let url = "http://localhost:8100/createRecipe";
            let query = new URLSearchParams(newRecipe);
            url = url + "?" + query.toString();
            let resp = await fetch(url);
            let data = await resp.json();
            console.log(data);
            console.log(url);
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