namespace KMJ {
    
    
    
    
    document.getElementById("createIconHidden").addEventListener("click", createRecipe);
    
    function createRecipe(): void {
        window.location.href = "./create_edit.html";
    }
    
    
    
    
    
    
    
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    }
    
    
    
    
    
    
    let navicons: NodeListOf<HTMLElement>  = document.querySelectorAll("nav i");
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
        
        if (document.getElementById("createIconHidden")) {
            document.getElementById("createIconHidden").id = "createIcon";
        }
        
        
        
        
        break;
        default:
        document.getElementById("allIcon").click();
        break;
    }
    
    
    
    
    function changePage(_event: Event): void {
        let siteTitle: HTMLHeadingElement = <HTMLHeadingElement> document.getElementById("site_title");
        let icon: HTMLHtmlElement = undefined;
        
        let clickedIcon: HTMLElement = <HTMLElement>_event.target;
        let pageId: string = clickedIcon.id;
        
        if (sessionStorage.currentP == "MYRECIPES") {
            if (document.getElementById("createIcon")) {
                
                
                document.getElementById("createIcon").id = "createIconHidden";
            }
        }
        
        
        switch (pageId) {
            case "allIcon":
            siteTitle.innerText = "All Recipes";
            icon = <HTMLHtmlElement> document.getElementById("allIcon");
            sessionStorage.currentP = "ALL";
            break;
            case "faveIcon":
            siteTitle.innerText = "My Favorites";
            icon = <HTMLHtmlElement> document.getElementById("faveIcon");
            sessionStorage.currentP = "FAVORITES";
            break;
            case "myIcon":
            siteTitle.innerText = "My Recipes";
            sessionStorage.currentP = "MYRECIPES";
            if ( document.getElementById("createIconHidden")) {
                document.getElementById("createIconHidden").id = "createIcon";
            }
            
            
            icon = <HTMLHtmlElement> document.getElementById("myIcon");
            break;
        }
        for (let ico of navicons) {
            ico.className = ico.className.replace("currentIcon", "");
        }    
        icon.className = icon.className + " currentIcon";
        
        getRecipes(["main", "dessert", "starter", "misc"], sessionStorage.currentP);
        
    }
    
    
    
    
    function getRecipes(_filters: string[], _page: string): void {
        
        let foundrecipes: Recipe[] = [];
        let recipeList: Recipe[] = [];
        switch (_page) {
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
        }
        
        
        
        
        
        
        
        
        
        let recipiesContainer: HTMLDivElement = <HTMLDivElement> document.getElementById("recepies");
        recipiesContainer.innerHTML = "";
        
        for ( let recipe of foundrecipes) {
            let recipeContainer: HTMLDivElement = document.createElement("div");
            recipeContainer.className = "recipe";
            
            let courseParagraph: HTMLParagraphElement = document.createElement("p");
            courseParagraph.innerText = recipe.course;
            courseParagraph.className = "course " + recipe.course;
            recipeContainer.appendChild(courseParagraph);
            
            let recipeTitle: HTMLHeadingElement = document.createElement("h4");
            recipeTitle.innerText = recipe.title;
            recipeContainer.appendChild(recipeTitle);
            
            let timeParagraph: HTMLParagraphElement = document.createElement("p");
            timeParagraph.className = "time";
            timeParagraph.innerText = recipe.duration;
            recipeContainer.appendChild(timeParagraph);
            
            let heartIcon: HTMLElement = document.createElement("i");
            heartIcon.className = "far fa-heart";
            heartIcon.id = "heart";
            recipeContainer.appendChild(heartIcon);
            
            let authorParagraph: HTMLParagraphElement = document.createElement("p");
            authorParagraph.innerHTML = "<i>" + recipe.author + "</i>";
            recipeContainer.appendChild(authorParagraph);
            
            //---- replace with recipe ID after database anknüpfung
            recipeContainer.dataset.recipeId = recipe.title;
            recipiesContainer.appendChild(recipeContainer);
            
            recipeContainer.addEventListener("click", viewRecipe);
            
            
            
        }
        
        
    }
    
    
    
    //----------------------------------------view Recipe------------//
    
    function viewRecipe(_event: Event): void {
        let rp: HTMLElement = <HTMLDivElement> _event.target;
        
        if (rp.className != "recipe") {
            if (rp.id == "heart") {
                rp.className = "fas fa-heart";  
                return;
            } else {
                if (rp.parentElement.className == "recipe") {
                    rp = rp.parentElement;
                } else {
                    rp = rp.parentElement.parentElement;
                }
            }
        }
        //
        
        sessionStorage.viewRecipeId = rp.dataset.recipeId;
        console.log(sessionStorage.viewRecipeId);
        window.location.href = "view.html";
        
    }   
    
    
    
    
    
    // --------------------------------------- filtersearch --------//
    
    
    document.getElementById("submitFilters").addEventListener("click", filterSearch);
    
    
    function filterSearch(): void {
        let filterform: FormData = new FormData(document.forms[0]);
        
        
        let filters: string[] = [];
        for (let i: number = 1; i <= 4; i++ ) {
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
















