"use strict";
var KMJ;
(function (KMJ) {
    ///-------------TO-DO-----------------------------////
    /*
    
    - fontawesome auswechseln mit wahren SVGs davon
    - gestaltung create/edit seite
    
    -editierung--> rezept hineinladen
    
    
    - Favorisierung
    
    - editierung & löschung von rezepten
    
    
    - serveranbindung
    
    - datenbankanbindung
    
    
    -user creation & login datenbank
    
    -rezept datenbank
    
    
    
    
    */
    document.getElementById("createIconHidden").addEventListener("click", createRecipe);
    function createRecipe() {
        window.location.href = "./create_edit.html";
    }
    let user = undefined;
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    }
    else {
        // find user from database
        for (let iUser of KMJ.users) {
            if (iUser.name == sessionStorage.user) {
                user = iUser;
                break;
            }
        }
    }
    let navicons = document.querySelectorAll(".iconContainer");
    for (let ico of navicons) {
        console.log(ico);
        ico.addEventListener("click", changePage);
    }
    console.log(sessionStorage.currentP);
    switch (sessionStorage.currentP) {
        case "FAVORITES":
            document.getElementById("faveIconSpan").click();
            break;
        case "MYRECIPES":
            document.getElementById("myIconSpan").click();
            if (document.getElementById("createIconHidden")) {
                document.getElementById("createIconHidden").id = "createIcon";
            }
            break;
        default:
            document.getElementById("allIconSpan").click();
            break;
    }
    function changePage(_event) {
        let siteTitle = document.getElementById("site_title");
        let icon = undefined;
        let clickedIcon = _event.target;
        let pageId = clickedIcon.id;
        console.log(pageId);
        if (sessionStorage.currentP == "MYRECIPES") {
            if (document.getElementById("createIcon")) {
                document.getElementById("createIcon").id = "createIconHidden";
            }
        }
        switch (pageId) {
            case "allIconSpan":
                siteTitle.innerText = "All Recipes";
                icon = document.getElementById("allIconSpan");
                console.log("allicon-- " + icon);
                sessionStorage.currentP = "ALL";
                break;
            case "faveIconSpan":
                siteTitle.innerText = "My Favorites";
                icon = document.getElementById("faveIconSpan");
                sessionStorage.currentP = "FAVORITES";
                console.log("fave-- " + icon);
                break;
            case "myIconSpan":
                siteTitle.innerText = "My Recipes";
                sessionStorage.currentP = "MYRECIPES";
                if (document.getElementById("createIconHidden")) {
                    document.getElementById("createIconHidden").id = "createIcon";
                }
                console.log("my-- " + icon);
                icon = document.getElementById("myIconSpan");
                break;
        }
        for (let ico of navicons) {
            ico.className = ico.className.replace("currentIcon", "");
        }
        icon.className = icon.className + " currentIcon";
        getRecipes(["main", "dessert", "starter", "misc"], sessionStorage.currentP);
    }
    function getRecipes(_filters, _page) {
        let foundrecipes = [];
        let recipeList = [];
        switch (_page) {
            case "ALL":
                recipeList = KMJ.recipes;
                break;
            case "FAVORITES":
                for (let user of KMJ.users) {
                    if (user.name == sessionStorage.user) {
                        for (let favorite of user.favorites)
                            for (let recipe of KMJ.recipes) {
                                if (favorite == recipe.title) {
                                    recipeList[recipeList.length] = recipe;
                                    break;
                                }
                            }
                    }
                }
                break;
            case "MYRECIPES":
                for (let recipe of KMJ.recipes) {
                    if (sessionStorage.user == recipe.author) {
                        recipeList[recipeList.length] = recipe;
                    }
                }
                break;
        }
        for (let recipe of recipeList) {
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
            let favorised = false;
            if (user.favorites.includes(recipe.title)) {
                favorised = true;
            }
            if (_page == "MYRECIPES") {
                let deleteIcon = document.createElement("img");
                deleteIcon.src = "../images/trash.svg";
                deleteIcon.className = "recipeControllIcon";
                recipeContainer.appendChild(deleteIcon);
                let editIcon = document.createElement("img");
                editIcon.src = "../images/edit.svg";
                editIcon.className = "recipeControllIcon";
                recipeContainer.appendChild(editIcon);
            }
            let heartimg = document.createElement("img");
            if (favorised) {
                heartimg.src = "../images/heart.svg";
            }
            else {
                heartimg.src = "../images/heartOutline.svg";
            }
            heartimg.className = "recipeControllIcon";
            recipeContainer.appendChild(heartimg);
            let authorParagraph = document.createElement("p");
            authorParagraph.innerHTML = "<i>" + recipe.author + "</i>";
            recipeContainer.appendChild(authorParagraph);
            //---- replace with recipe ID after database anknüpfung
            recipeContainer.dataset.recipeId = recipe.title;
            recipiesContainer.appendChild(recipeContainer);
            recipeContainer.addEventListener("click", viewRecipe);
        }
    }
    //----------------------------------------view Recipe------------//
    function viewRecipe(_event) {
        let rp = _event.target;
        sessionStorage.viewRecipeId = rp.dataset.recipeId;
        console.log(sessionStorage.viewRecipeId);
        if (rp.className != "recipe") {
            if (rp.className == "recipeControllIcon") {
                let ctrImage = rp;
                if (ctrImage.src.includes("heart")) {
                    return;
                }
                else if (ctrImage.src.includes("edit")) {
                    window.location.href = "./create_edit.html";
                }
                else if (ctrImage.src.includes("trash")) {
                    //ok/cancel dialog ob jemand wirklich rezept löschen will oder nicht
                    if (confirm("are you sure you want to delete this recipe?")) {
                        console.log("ja");
                    }
                    else {
                        console.log("nein");
                    }
                    return;
                }
            }
            else {
                if (rp.parentElement.className == "recipe") {
                    rp = rp.parentElement;
                }
                else {
                    rp = rp.parentElement.parentElement;
                }
                window.location.href = "view.html";
            }
        }
        //
    }
    // --------------------------------------- filtersearch --------//
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
        getRecipes(filters, sessionStorage.currentP);
    }
})(KMJ || (KMJ = {}));
//# sourceMappingURL=script.js.map