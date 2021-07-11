namespace KMJ {
    
    
    
    document.getElementById("createIconHidden").addEventListener("click", createRecipe);
    
    function createRecipe(): void {
        sessionStorage.editRecipeId = "";
        window.location.href = "./create_edit.html";
    }
    
    
    
    let currentuser: User = undefined;
    
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    } else {
        
        
        
        getuser(sessionStorage.user).then(main);
        
    }
    // find user from database
    
    
    
    async function getuser(_username: string): Promise<void> {
        //let url: string = "http://localhost:8100/getUser?" + "username=" + _username;
        let url: string = "https://kochem-mit-jochem.herokuapp.com/getUser?" + "username=" + _username;
        
        let resp: Response = await fetch(url);
        currentuser = await resp.json();
        
        
    }
    
    
    function main(): void {
        
        let navicons: NodeListOf<HTMLSpanElement>  = document.querySelectorAll(".iconContainer");
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
        
        
        
        
        function changePage(_event: Event): void {
            let siteTitle: HTMLHeadingElement = <HTMLHeadingElement> document.getElementById("site_title");
            let icon: HTMLSpanElement = undefined;
            
            let clickedIcon: HTMLSpanElement = <HTMLSpanElement>    _event.target;
            
            let pageId: string = clickedIcon.id;
            
            
            if (sessionStorage.currentP == "MYRECIPES") {
                if (document.getElementById("createIcon")) {
                    
                    
                    document.getElementById("createIcon").id = "createIconHidden";
                }
            }
            
            
            switch (pageId) {
                case "allIconSpan":
                siteTitle.innerText = "All Recipes";
                icon = <HTMLElement> document.getElementById("allIconSpan");
                
                sessionStorage.currentP = "ALL";
                break;
                case "faveIconSpan":
                siteTitle.innerText = "My Favorites";
                icon = <HTMLSpanElement> document.getElementById("faveIconSpan");
                sessionStorage.currentP = "FAVORITES";
                
                break;
                case "myIconSpan":
                siteTitle.innerText = "My Recipes";
                sessionStorage.currentP = "MYRECIPES";
                if ( document.getElementById("createIconHidden")) {
                    document.getElementById("createIconHidden").id = "createIcon";
                }
                
                
                icon =  <HTMLSpanElement> document.getElementById("myIconSpan");
                break;
            }
            
            for (let ico of navicons) {
                ico.className = ico.className.replace("currentIcon", "");
            }    
            icon.className = icon.className + " currentIcon";
            
            getRecipes(["main", "dessert", "starter", "misc"], sessionStorage.currentP);
            
        }
        
        
        interface RecipeRequest {
            filters: string[];
            page: string;
            username: string;
        }
        
        
        
        async function getRecipes(_filters: string[], _page: string): Promise<void> {
            //let url: string = "http://localhost:8100/findRecipes";
            let url: string = "https://kochem-mit-jochem.herokuapp.com/findRecipes";
            
            let recipeRequest: RecipeRequest = { filters: _filters, page: _page, username: sessionStorage.user};
            
            let query: URLSearchParams = new URLSearchParams(<any>recipeRequest);
            url = url + "?" + query.toString();
            let resp: Response = await fetch(url);
            let foundrecipes: RecipeFull[]  = await resp.json();
            
            
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
                
                
                let favorised: boolean = false;
                
                if (currentuser.favorites.includes(recipe._id.toString())) {
                    favorised = true;
                }
                
                let recipeFooter: HTMLDivElement = document.createElement("div");
                recipeFooter.className = "recipeFooter";
                recipeContainer.appendChild(recipeFooter);
                
                
                let authorParagraph: HTMLParagraphElement = document.createElement("p");
                authorParagraph.className = "authorPara";
                authorParagraph.innerHTML = "<i>" + recipe.author + "</i>";
                recipeFooter.appendChild(authorParagraph);
                
                
                
                if (_page == "MYRECIPES") {
                    let deleteIcon: HTMLImageElement = document.createElement("img");
                    deleteIcon.src = "../images/trash.svg";
                    deleteIcon.className = "recipeControllIcon";
                    recipeFooter.appendChild(deleteIcon);
                    
                    let editIcon: HTMLImageElement = document.createElement("img");
                    editIcon.src = "../images/edit.svg";
                    editIcon.className = "recipeControllIcon";
                    recipeFooter.appendChild(editIcon);
                    
                }
                
                let heartimg: HTMLImageElement = document.createElement("img");
                if (favorised) {
                    heartimg.src = "../images/heart.svg";
                } else {
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
        
        async function handleRecipeClick(_event: Event): Promise<void> {
            let rp: HTMLElement = <HTMLDivElement> _event.target;
            
            
            if (rp.className != "recipe") {
                if (rp.className == "recipeControllIcon") {
                    let ctrImage:  HTMLImageElement = <HTMLImageElement> rp;
                    
                    let recepieParantelement: HTMLElement = rp.parentElement.parentElement;
                    if (ctrImage.src.includes("heart")) {
                        ctrImage.className = ctrImage.className + " heartClick";   
                        
                        
                        //let url: string = "http://localhost:8100/favoriteRecipe?id=" + rp.parentElement.dataset.recipeId + "&username=" + currentuser.username;
                        let url: string = "https://kochem-mit-jochem.herokuapp.com/favoriteRecipe?id=" + recepieParantelement.dataset.recipeId + "&username=" + currentuser.username;
                        
                        let resp: Response = await fetch(url);
                        let sR: ServerResponse = await resp.json();
                        console.log(sR.message);
                        
                        filterSearch();
                        
                        
                        return;
                    } else if (ctrImage.src.includes("edit")) {
                        
                        
                        sessionStorage.editRecipeId = recepieParantelement.dataset.recipeId;
                        window.location.href = "./create_edit.html";
                        return;
                    } else if (ctrImage.src.includes("trash")) {
                        //ok/cancel dialog ob jemand wirklich rezept löschen will oder nicht
                        if (confirm("are you sure you want to delete this recipe?")) {
                            let recipeID: string = recepieParantelement.dataset.recipeId;
                            
                            
                            //let url: string = "http://localhost:8100/deleteRecipe?id=" + recipeID ;
                            let url: string = "https://kochem-mit-jochem.herokuapp.com/deleteRecipe?id=" + recipeID;
                            
                            
                            let resp: Response = await fetch(url);
                            let sR: ServerResponse = await resp.json();
                            console.log(sR.message);
                            // window.location.href = "./Main.html"; 
                            filterSearch();
                        } 
                        
                        
                        
                        
                        return;
                    }
                } else {
                    if (rp.parentElement.className == "recipe") {
                        rp = rp.parentElement;
                    } else {
                        rp = rp.parentElement.parentElement;
                    }
                   
                }
            } 
            sessionStorage.viewRecipeId = rp.dataset.recipeId;
            window.location.href = "view.html";
            
            
        }   
        
        
        
        
        
        // ------------------- filtersearch>>suche mit filterparametern -----------------------------//
        
        
        document.getElementById("submitFilters").addEventListener("click", filterSearch);
        
        
        async function filterSearch(): Promise<void> {
            let filterform: FormData = new FormData(document.forms[0]);
            
            await getuser(sessionStorage.user);
            let filters: string[] = [];
            for (let i: number = 1; i <= 4; i++ ) {
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
    
}
















