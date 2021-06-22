namespace KMJ {

    
    
    /*   enum Page {
        ALL, FAVORITE, MYRECIPES
    }  */
    
    
    
    
    
    
    
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
    switch (pageId) {
        case "allIcon":
        siteTitle.innerText = "All Recipes";
        icon = <HTMLHtmlElement> document.getElementById("allIcon");
        sessionStorage.currentP = "ALL";
        break;
        case "faveIcon":
        siteTitle.innerText = "Favorites";
        icon = <HTMLHtmlElement> document.getElementById("faveIcon");
        sessionStorage.currentP = "FAVORITES";
        break;
        case "myIcon":
        siteTitle.innerText = "My Recipes";
        sessionStorage.currentP = "MYRECIPES";
        icon = <HTMLHtmlElement> document.getElementById("myIcon");
        break;
    }
    for (let ico of navicons) {
        ico.className = ico.className.replace("currentIcon", "");
    }    
    icon.className = icon.className + " currentIcon";

    getRecipes(["main", "dessert", "starter", "misc"], "ALL");

}
    



    function getRecipes(_filters: string[], _page: string): void {
        
        
        let foundrecipes: Recipe[] = [];
        for (let  recipe of recipes ) {
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
            recipeContainer.appendChild(heartIcon);

            let authorParagraph: HTMLParagraphElement = document.createElement("p");
            authorParagraph.innerHTML = "<i>" + recipe.author + "</i>";
            recipeContainer.appendChild(authorParagraph);

            recipiesContainer.appendChild(recipeContainer);

        }


    }

// ------ filtersearch --------//


    document.getElementById("submitFilters").addEventListener("click", filterSearch);


    function filterSearch(): void {
        let filterform: FormData = new FormData(document.forms[0]);
      
        
        let filters: string[] = [];
        for (let i: number = 1; i <= 4; i++ ) {
            if (filterform.get("course" + i)) {
                filters[filters.length] = "" + filterform.get("course" + i);
            }
        }
        if(filters.length == 0){
            filters = ["starter", "main", "dessert","misc"];
        }
        console.log(filters);
        
        getRecipes(filters, "ALL");
    }


 
}
















