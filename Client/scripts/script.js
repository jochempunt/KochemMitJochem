"use strict";
var KMJ;
(function (KMJ) {
    /*   enum Page {
        ALL, FAVORITE, MYRECIPES
    }  */
    let navicons = document.querySelectorAll("nav i");
    for (let ico of navicons) {
        if (ico.id) {
            ico.addEventListener("click", changePage);
        }
    }
    console.log(sessionStorage.currentP);
    switch (sessionStorage.currentP) {
        case "FAVORITES":
            document.getElementById("faveIcon").click();
            break;
        case "MYRECIPES":
            document.getElementById("myIcon").click();
            break;
        default:
            document.getElementById("allIcon").click();
            break;
    }
    function changePage(_event) {
        let siteTitle = document.getElementById("site_title");
        let icon = undefined;
        let clickedIcon = _event.target;
        let pageId = clickedIcon.id;
        switch (pageId) {
            case "allIcon":
                siteTitle.innerText = "All Recipes";
                icon = document.getElementById("allIcon");
                sessionStorage.currentP = "ALL";
                break;
            case "faveIcon":
                siteTitle.innerText = "Favorites";
                icon = document.getElementById("faveIcon");
                sessionStorage.currentP = "FAVORITES";
                break;
            case "myIcon":
                siteTitle.innerText = "My Recipes";
                sessionStorage.currentP = "MYRECIPES";
                icon = document.getElementById("myIcon");
                break;
        }
        for (let ico of navicons) {
            ico.className = ico.className.replace("currentIcon", "");
        }
        icon.className = icon.className + " currentIcon";
        getRecipes(["main", "dessert", "starter", "misc"], "ALL");
    }
    function getRecipes(_filters, _page) {
        let foundrecipes = [];
        for (let recipe of KMJ.recipes) {
            for (let i = 0; i <= _filters.length; i++) {
                console.log(recipe.title + ":" + recipe.course);
                if (recipe.course == _filters[i]) {
                    foundrecipes[foundrecipes.length] = recipe;
                    break;
                }
            }
        }
        let recipiesContainer = document.getElementById("recepies");
        recipiesContainer.innerHTML = "";
        for (let recipe of foundrecipes) {
            let recipeContainer = document.createElement("div");
            recipeContainer.className = "recipe";
            let courseParagraph = document.createElement("p");
            courseParagraph.innerText = recipe.course;
            courseParagraph.className = "course " + recipe.course;
            recipeContainer.appendChild(courseParagraph);
            let recipeTitle = document.createElement("h4");
            recipeTitle.innerText = recipe.title;
            recipeContainer.appendChild(recipeTitle);
            let timeParagraph = document.createElement("p");
            timeParagraph.className = "time";
            timeParagraph.innerText = recipe.duration;
            recipeContainer.appendChild(timeParagraph);
            let heartIcon = document.createElement("i");
            heartIcon.className = "far fa-heart";
            recipeContainer.appendChild(heartIcon);
            let authorParagraph = document.createElement("p");
            authorParagraph.innerHTML = "<i>" + recipe.author + "</i>";
            recipeContainer.appendChild(authorParagraph);
            recipiesContainer.appendChild(recipeContainer);
        }
    }
    // ------ filtersearch --------//
    document.getElementById("submitFilters").addEventListener("click", filterSearch);
    function filterSearch() {
        let filterform = new FormData(document.forms[0]);
        let filters = [];
        for (let i = 1; i <= 4; i++) {
            if (filterform.get("course" + i)) {
                filters[filters.length] = "" + filterform.get("course" + i);
            }
        }
        if (filters.length == 0) {
            filters = ["starter", "main", "dessert", "misc"];
        }
        console.log(filters);
        getRecipes(filters, "ALL");
    }
})(KMJ || (KMJ = {}));
//# sourceMappingURL=script.js.map