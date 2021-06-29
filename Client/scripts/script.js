"use strict";
var KMJ;
(function (KMJ) {
    ///-------------TO-DO-----------------------------////
    /*
    
    
    
    
    - Favorisierung
    
    - editierung & löschung von rezepten
    
    
    - serveranbindung
    
    - datenbankanbindung
    
    
    -user creation & login datenbank
    
    -rezept datenbank
    
    
    
    
    */
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
        console.log(sessionStorage.user);
        console.log("getUser");
        getuser(sessionStorage.user).then(main);
    }
    // find user from database
    async function getuser(_username) {
        //let url: string = "http://localhost:8100/getUser?" + "username=" + _username;
        let url = "https://kochem-mit-jochem.herokuapp.com/getUser?" + "username=" + _username;
        let resp = await fetch(url);
        currentuser = await resp.json();
        console.log("currentuser=" + currentuser.username);
    }
    function main() {
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
        async function getRecipes(_filters, _page) {
            //let url: string = "http://localhost:8100/findRecipes";
            let url = "https://kochem-mit-jochem.herokuapp.com/findRecipes";
            let recipeRequest = { filters: _filters, page: _page, username: sessionStorage.user };
            let query = new URLSearchParams(recipeRequest);
            url = url + "?" + query.toString();
            let resp = await fetch(url);
            let foundrecipes = await resp.json();
            /*let foundrecipes: Recipe[] = [];
            let recipeList: Recipe[] = [];*/
            /* switch (_page) {
                case "ALL":
                
                
                
                
                recipeList = recipes;
                break;
                case"FAVORITES":
                for (let user of users) {
                    if ( user.name == sessionStorage.user) {
                        for (let favorite of user.favorites)
                        for ( let recipe of recipes) {
                            if (favorite == recipe.title) {
                                recipeList[recipeList.length] = recipe;
                                break;
                            }
                        }
                    }
                }
                break;
                case"MYRECIPES":
                for (let recipe of recipes) {
                    if (sessionStorage.user == recipe.author) {
                        recipeList[recipeList.length] = recipe;
                    }
                }
                break;
            }
            
            
            for (let  recipe of recipeList ) {
                for (let i: number = 0; i <= _filters.length; i++) {
                    console.log(recipe.title + ":" + recipe.course);
                    if (recipe.course == _filters[i]) {
                        foundrecipes[foundrecipes.length] = recipe;
                        break;
                        
                    }
                }
            } */
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
                console.log(recipe._id.toString());
                if (currentuser.favorites.includes(recipe._id.toString())) {
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
                recipeContainer.dataset.recipeId = recipe._id.toString();
                recipiesContainer.appendChild(recipeContainer);
                recipeContainer.addEventListener("click", viewRecipe);
            }
        }
        //----------------------------------------view Recipe------------//
        async function viewRecipe(_event) {
            let rp = _event.target;
            if (rp.className != "recipe") {
                if (rp.className == "recipeControllIcon") {
                    let ctrImage = rp;
                    if (ctrImage.src.includes("heart")) {
                        console.log(rp.parentElement.dataset.recipeId);
                        //let url: string = "http://localhost:8100/favoriteRecipe?id=" + rp.parentElement.dataset.recipeId + "&username=" + currentuser.username;
                        let url = "https://kochem-mit-jochem.herokuapp.com/favoriteRecipe?id=" + rp.parentElement.dataset.recipeId + "&username=" + currentuser.username;
                        console.log(url);
                        let resp = await fetch(url);
                        let sR = await resp.json();
                        console.log(sR.message);
                        filterSearch();
                        return;
                    }
                    else if (ctrImage.src.includes("edit")) {
                        console.log(rp.parentElement.dataset.recipeId);
                        sessionStorage.editRecipeId = rp.parentElement.dataset.recipeId;
                        window.location.href = "./create_edit.html";
                    }
                    else if (ctrImage.src.includes("trash")) {
                        //ok/cancel dialog ob jemand wirklich rezept löschen will oder nicht
                        if (confirm("are you sure you want to delete this recipe?")) {
                            let recipeID = rp.parentElement.dataset.recipeId;
                            console.log(recipeID);
                            //let url: string = "http://localhost:8100/deleteRecipe?id=" + recipeID ;
                            let url = "https://kochem-mit-jochem.herokuapp.com/deleteRecipe?id=" + recipeID;
                            console.log(url);
                            let resp = await fetch(url);
                            let sR = await resp.json();
                            console.log(sR.message);
                            // window.location.href = "./Main.html"; 
                            filterSearch();
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
                    sessionStorage.viewRecipeId = rp.dataset.recipeId;
                    window.location.href = "view.html";
                }
            }
            //
        }
        // --------------------------------------- filtersearch --------//
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
            console.log(filters);
            getRecipes(filters, sessionStorage.currentP);
        }
    }
})(KMJ || (KMJ = {}));
//# sourceMappingURL=script.js.map