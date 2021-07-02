"use strict";
var KMJ;
(function (KMJ) {
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    }
    //let ingredientCount: number = 2; 
    let currentRecipe = undefined; //vorArbeit für wenn ein rezept bearbeitet oder angezeigt werden soll
    async function getOneRecipe(_searchID) {
        //let url: string = "http://localhost:8100/findOneRecipe";
        let url = "https://kochem-mit-jochem.herokuapp.com/findOneRecipe";
        url = url + "?_id=" + _searchID;
        let resp = await fetch(url);
        currentRecipe = await resp.json();
        console.log(currentRecipe);
    }
    if (sessionStorage.viewRecipeID != "") { // angeklicktes/ausgewähltes rezept wird aus der datenbank geladen
        console.log(sessionStorage.viewRecipeId);
        getOneRecipe(sessionStorage.viewRecipeId).then(view);
    }
    function view() {
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
            console.log(currentRecipe.ingredient_Amounts.length);
            for (let i = 0; i < currentRecipe.ingredient_Amounts.length; i++) {
                let li = document.createElement("li");
                let emAmount = document.createElement("em");
                emAmount.innerText = currentRecipe.ingredient_Amounts[i];
                let ingredientTextNode = document.createTextNode(" " + currentRecipe.ingredient_Names[i]);
                li.appendChild(emAmount);
                li.appendChild(ingredientTextNode);
                ingredientList.appendChild(li);
            }
            let directionP = document.getElementById("direction-paragraph");
            directionP.innerText = currentRecipe.directions;
        }
    }
})(KMJ || (KMJ = {}));
//# sourceMappingURL=viewScript.js.map