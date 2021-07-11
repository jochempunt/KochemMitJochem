"use strict";
var KMJ;
(function (KMJ) {
    // in currentrecipe wird das zu editierende rezept gespeichert.
    let currentRecipe = undefined;
    let ingredientCount = 2;
    function addIngredientField() {
        let newIngredientAmount = document.createElement("input");
        newIngredientAmount.type = "text";
        newIngredientAmount.className = "amount";
        newIngredientAmount.id = "Amount" + ingredientCount;
        newIngredientAmount.name = "Amount";
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
    if (sessionStorage.editRecipeId != "") { // angeklicktes/ausgewähltes rezept wird aus der datenbank geladen
        console.log("editRecipe=" + sessionStorage.editRecipeId);
        getOneRecipe(sessionStorage.editRecipeId).then(edit);
        async function getOneRecipe(_searchID) {
            //let url: string = "http://localhost:8100/findOneRecipe";
            let url = "https://kochem-mit-jochem.herokuapp.com/findOneRecipe";
            url = url + "?_id=" + _searchID;
            let resp = await fetch(url);
            currentRecipe = await resp.json();
        }
        //------------------------ edit ---------------------------//
        function edit() {
            // zuerst wird das zu editierende rezept in die jeweiligen formularfelder geladen
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
            // die ingredientfelder sind variabel dh. muss dies mit einer schleife gelöst werden
            let ingredientCount = currentRecipe.ingredient_Amounts.length;
            for (let i = 0; i < ingredientCount; i++) {
                if (i >= 2) { //es sind immer mindestens 2 lehre ingredient felder auf der seite
                    addIngredientField();
                }
                let amountInput = document.getElementById("Amount" + i);
                amountInput.value = currentRecipe.ingredient_Amounts[i];
                let ingredientInput = document.getElementById("IngredientName" + i);
                ingredientInput.value = currentRecipe.ingredient_Names[i];
            }
        }
    }
    // egal ob editiert oder ein neues rezept erstellt wird, es braucht immer diese 2 elemente
    let finishButton = document.getElementById("finishButtonMobile");
    finishButton.addEventListener("click", getRecipeOfForm);
    let plusIngredient = document.getElementById("plusIngredient");
    plusIngredient.addEventListener("click", addIngredientField);
    // funktion, welche das eingegebene in ein objekt von "recipe" einliest
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
            ingredient_Amounts: ingredientAmountlist,
            ingredient_Names: ingredientNamelist,
            _id: sessionStorage.editRecipeId
        };
        //..........send to database...................//
        let url = "";
        if (sessionStorage.editRecipeId != "") {
            //url = "http://localhost:8100/editRecipe";  
            url = "https://kochem-mit-jochem.herokuapp.com/editRecipe";
        }
        else {
            //url = "http://localhost:8100/createRecipe";
            url = "https://kochem-mit-jochem.herokuapp.com/createRecipe";
        }
        let query = new URLSearchParams(newRecipe);
        url = url + "?" + query.toString();
        let resp = await fetch(url);
        let data = await resp.json();
        console.log(data);
        window.location.href = "./Main.html";
    }
})(KMJ || (KMJ = {}));
//# sourceMappingURL=create_edit.js.map