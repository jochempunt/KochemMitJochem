

namespace KMJ {
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    }
    //let ingredientCount: number = 2; 
    
    let currentRecipe: Recipe = undefined; //vorArbeit für wenn ein rezept bearbeitet oder angezeigt werden soll
    
    
    export async function getOneRecipe(_searchID: string): Promise<void> {
        let url: string = "http://localhost:8100/findOneRecipe";
        url = url + "?_id=" + _searchID ;
        let resp: Response = await fetch(url);
        currentRecipe = await resp.json();
    }
    
    if (sessionStorage.viewRecipeID != "") {     // angeklicktes/ausgewähltes rezept wird aus der datenbank geladen
        console.log(sessionStorage.viewRecipeId);
        
        
        getOneRecipe(sessionStorage.viewRecipeId).then(view);
        
        
        
    }
    
    function view(): void {
        
        if (window.location.href.includes("view")) {
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
            
            for (let i: number = 0; i < currentRecipe.ingredient_Amounts.length; i++ ) {
                let li: HTMLLIElement = document.createElement("li");
                
                let emAmount: HTMLElement = document.createElement("em");
                emAmount.innerText = currentRecipe.ingredient_Amounts[i];
                
                let ingredientTextNode: Node = document.createTextNode(" " + currentRecipe.ingredient_Names[i]);
                li.appendChild(emAmount);
                li.appendChild(ingredientTextNode);
                ingredientList.appendChild(li);
            }
            
            let directionP: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("direction-paragraph");
            directionP.innerText = currentRecipe.directions;
        }
}





}
