"use strict";
var KMJ;
(function (KMJ) {
    document.getElementById("createIconHidden").addEventListener("click", createRecipe);
    function createRecipe() {
        sessionStorage.editRecipeId = "";
        window.location.href = "./create_edit.html";
    }
    let currentuser = undefined;
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    }
    else {
        getuser(sessionStorage.user).then(main);
    }
    // find user from database
    async function getuser(_username) {
        //let url: string = "http://localhost:8100/getUser?" + "username=" + _username;
        let url = "https://kochem-mit-jochem.herokuapp.com/getUser?" + "username=" + _username;
        let resp = await fetch(url);
        currentuser = await resp.json();
    }
    function main() {
        let navicons = document.querySelectorAll(".iconContainer");
        for (let ico of navicons) {
            ico.addEventListener("click", changePage);
        }
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
            if (sessionStorage.currentP == "MYRECIPES") {
                if (document.getElementById("createIcon")) {
                    document.getElementById("createIcon").id = "createIconHidden";
                }
            }
            switch (pageId) {
                case "allIconSpan":
                    siteTitle.innerText = "All Recipes";
                    icon = document.getElementById("allIconSpan");
                    sessionStorage.currentP = "ALL";
                    break;
                case "faveIconSpan":
                    siteTitle.innerText = "My Favorites";
                    icon = document.getElementById("faveIconSpan");
                    sessionStorage.currentP = "FAVORITES";
                    break;
                case "myIconSpan":
                    siteTitle.innerText = "My Recipes";
                    sessionStorage.currentP = "MYRECIPES";
                    if (document.getElementById("createIconHidden")) {
                        document.getElementById("createIconHidden").id = "createIcon";
                    }
                    icon = document.getElementById("myIconSpan");
                    break;
            }
            for (let ico of navicons) {
                ico.className = ico.className.replace("currentIcon", "");
            }
            icon.className = icon.className + " currentIcon";
            getRecipes(["main", "dessert", "starter", "misc"], sessionStorage.currentP);
        }
        async function getRecipes(_filters, _page) {
            //let url: string = "http://localhost:8100/findRecipes";
            let url = "https://kochem-mit-jochem.herokuapp.com/findRecipes";
            let recipeRequest = { filters: _filters, page: _page, username: sessionStorage.user };
            let query = new URLSearchParams(recipeRequest);
            url = url + "?" + query.toString();
            let resp = await fetch(url);
            let foundrecipes = await resp.json();
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
                if (currentuser.favorites.includes(recipe._id.toString())) {
                    favorised = true;
                }
                let recipeFooter = document.createElement("div");
                recipeFooter.className = "recipeFooter";
                recipeContainer.appendChild(recipeFooter);
                let authorParagraph = document.createElement("p");
                authorParagraph.className = "authorPara";
                authorParagraph.innerHTML = "<i>" + recipe.author + "</i>";
                recipeFooter.appendChild(authorParagraph);
                if (_page == "MYRECIPES") {
                    let deleteIcon = document.createElement("img");
                    deleteIcon.src = "../images/trash.svg";
                    deleteIcon.className = "recipeControllIcon";
                    recipeFooter.appendChild(deleteIcon);
                    let editIcon = document.createElement("img");
                    editIcon.src = "../images/edit.svg";
                    editIcon.className = "recipeControllIcon";
                    recipeFooter.appendChild(editIcon);
                }
                let heartimg = document.createElement("img");
                if (favorised) {
                    heartimg.src = "../images/heart.svg";
                }
                else {
                    heartimg.src = "../images/heartOutline.svg";
                }
                heartimg.className = "recipeControllIcon";
                recipeFooter.appendChild(heartimg);
                recipeContainer.dataset.recipeId = recipe._id.toString();
                recipiesContainer.appendChild(recipeContainer);
                recipeContainer.addEventListener("click", handleRecipeClick);
            }
        }
        //-------------handleClick>>jede klickaktion auf recipe wird in dieser funktion bearbeitet------------------//
        async function handleRecipeClick(_event) {
            let rp = _event.target;
            if (rp.className != "recipe") {
                if (rp.className == "recipeControllIcon") {
                    let ctrImage = rp;
                    let recepieParantelement = rp.parentElement.parentElement;
                    if (ctrImage.src.includes("heart")) {
                        ctrImage.className = ctrImage.className + " heartClick";
                        //let url: string = "http://localhost:8100/favoriteRecipe?id=" + rp.parentElement.dataset.recipeId + "&username=" + currentuser.username;
                        let url = "https://kochem-mit-jochem.herokuapp.com/favoriteRecipe?id=" + recepieParantelement.dataset.recipeId + "&username=" + currentuser.username;
                        let resp = await fetch(url);
                        let sR = await resp.json();
                        console.log(sR.message);
                        filterSearch();
                        return;
                    }
                    else if (ctrImage.src.includes("edit")) {
                        sessionStorage.editRecipeId = recepieParantelement.dataset.recipeId;
                        window.location.href = "./create_edit.html";
                        return;
                    }
                    else if (ctrImage.src.includes("trash")) {
                        //ok/cancel dialog ob jemand wirklich rezept löschen will oder nicht
                        if (confirm("are you sure you want to delete this recipe?")) {
                            let recipeID = recepieParantelement.dataset.recipeId;
                            //let url: string = "http://localhost:8100/deleteRecipe?id=" + recipeID ;
                            let url = "https://kochem-mit-jochem.herokuapp.com/deleteRecipe?id=" + recipeID;
                            let resp = await fetch(url);
                            let sR = await resp.json();
                            console.log(sR.message);
                            // window.location.href = "./Main.html"; 
                            filterSearch();
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
                }
            }
            sessionStorage.viewRecipeId = rp.dataset.recipeId;
            window.location.href = "view.html";
        }
        // ------------------- filtersearch>>suche mit filterparametern -----------------------------//
        document.getElementById("submitFilters").addEventListener("click", filterSearch);
        async function filterSearch() {
            let filterform = new FormData(document.forms[0]);
            await getuser(sessionStorage.user);
            let filters = [];
            for (let i = 1; i <= 4; i++) {
                if (filterform.get("course" + i)) {
                    filters[filters.length] = "" + filterform.get("course" + i);
                }
            }
            if (filters.length == 0) {
                filters = ["starter", "main", "dessert", "misc"];
            }
            getRecipes(filters, sessionStorage.currentP);
        }
    }
})(KMJ || (KMJ = {}));
//# sourceMappingURL=script.js.map