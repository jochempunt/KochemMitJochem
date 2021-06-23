namespace KMJ {
    
    
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    }
    
    
    
    console.log(sessionStorage.viewRecipeId);
    let currentRecipe: Recipe = undefined;
    for (let recipe of recipes) {
        if (recipe.title == sessionStorage.viewRecipeId) {
            currentRecipe = recipe;
            break;
        }
    }
    
    
    let title: HTMLHeadingElement = <HTMLHeadingElement> document.getElementById("Title");
    
    if (currentRecipe) {
        title.innerText = currentRecipe.title;
    }
    
    let courseP: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("course");
    courseP.className = currentRecipe.course;
    courseP.innerText = currentRecipe.course;
    
    let durationP: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("duration");
    durationP.innerText = currentRecipe.duration;


    let authorP: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("author");
    authorP.innerText = "von: " + currentRecipe.author;
    
    let portions: HTMLElement = <HTMLElement> document.getElementById("portionNumber");
    portions.innerText = "" + currentRecipe.portions;

    let ingredientList: HTMLUListElement = <HTMLUListElement> document.getElementById("ingredient-list");

    
    for (let ingredient of currentRecipe.ingredients) {
        let li: HTMLLIElement = document.createElement("li");
        
        let emAmount: HTMLElement = document.createElement("em");
        emAmount.innerText = ingredient.amount;
        
        let ingredientTextNode: Node = document.createTextNode(" " + ingredient.name);
        
        li.appendChild(emAmount);
        li.appendChild(ingredientTextNode);
        ingredientList.appendChild(li);
    }

    let directionP: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("direction-paragraph");
    directionP.innerText = currentRecipe.directions;
    

    }