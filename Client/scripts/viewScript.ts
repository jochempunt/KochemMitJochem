

namespace KMJ {
    if (!sessionStorage.user) {
        window.location.href = "./login.html";
    }
    let ingredientCount: number = 2; 
    
    let currentRecipe: Recipe = undefined; //vorArbeit für wenn ein rezept bearbeitet oder angezeigt werden soll
    if (sessionStorage.viewRecipeID != "") {     // angeklicktes/ausgewähltes rezept wird aus der datenbank geladen
        console.log(sessionStorage.viewRecipeId);
        for (let recipe of recipes) {
            if (recipe.title == sessionStorage.viewRecipeId) {
                currentRecipe = recipe;
                break;
            }
        }
    }
    
    
    
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
    } else if (window.location.href.includes("create_edit")) {
        
        console.log(sessionStorage.editRecipeId);
        
        if (sessionStorage.editRecipeId != "") {     // angeklicktes/ausgewähltes rezept wird aus der datenbank geladen
            console.log(sessionStorage.editRecipeId);
            for (let recipe of recipes) {
                if (recipe.title == sessionStorage.editRecipeId) {
                    currentRecipe = recipe;
                    
                    let title: HTMLInputElement = <HTMLInputElement> document.getElementById("title");
                    title.value = currentRecipe.title;
                    
                    let duration: HTMLInputElement = <HTMLInputElement> document.getElementById("durations");
                    duration.value = currentRecipe.duration;
                    
                    let selectCourse: HTMLInputElement = <HTMLInputElement> document.getElementById("select");
                    selectCourse.value = currentRecipe.course;
                    
                    let portion: HTMLInputElement = <HTMLInputElement> document.getElementById("portions");
                    portion.value = currentRecipe.portions.toString();
                    
                    let directions: HTMLTextAreaElement = <HTMLTextAreaElement> document.getElementById("directions");
                    directions.value = currentRecipe.directions;
                    
                    let ingredientCount: number = currentRecipe.ingredient_Amounts.length;
                    
                    for (let i: number = 0; i < ingredientCount; i ++) {
                        if (i >= 2) { //es sind immer mindestens 2 lehre ingredient felder auf der seite
                            addIngredientField();
                            
                        } 
                        
                        let amountInput: HTMLInputElement = <HTMLInputElement> document.getElementById("Amount" + i);
                        amountInput.value = currentRecipe.ingredient_Amounts[i];
                        //amountInput.value = currentRecipe.ingredients[i].amount;
                        let ingredientInput: HTMLInputElement  = <HTMLInputElement>document.getElementById("IngredientName" + i);
                        ingredientInput.value = currentRecipe.ingredient_Names[i];
                        // ingredientInput.value = currentRecipe.ingredients[i].name;
                    }
                }
            }
        }
        
        


        let finishButton: HTMLDivElement = <HTMLDivElement> document.getElementById("finishButtonMobile");
        finishButton.addEventListener("click", getRecipeOfForm);
        
        let plusIngredient: HTMLDivElement = <HTMLDivElement> document.getElementById("plusIngredient");
        plusIngredient.addEventListener("click", addIngredientField);
       
        async function getRecipeOfForm(): Promise<void> {
            let formdata: FormData = new FormData(document.forms[0]);
            
            // grund warum ingredient kein eigenes interface mit 2 werten ist, eine solche verschachtelung
            // würde durch Searchparams zu [object][object] umwandelnt dh habe ich mich für eine "flattend"/ 
            //primitivere weise entschieden
            
            
            /*let hah :Map<string,string> = new Map; <--  ... vllt doch lieber implementierun map?
            hah.set("lol","ey");*/


            let ingredientNamelist: string[] = [];

            let ingredientAmountlist: string[] = [];


            let i: number = 0;
            for (let fom of formdata.getAll("Amount")) {
                let ingedientAmount: string =  fom.toString() ;
                let ingredientName: string = formdata.get("IngredientName" + i).toString();
                ingredientAmountlist[ingredientAmountlist.length] = ingedientAmount;
                ingredientNamelist[ingredientNamelist.length] = ingredientName;
                i++; 
            } 
            
            let newRecipe: Recipe = {title: formdata.get("recipeTitle").toString(),
            duration: formdata.get("duration").toString(),
            course: formdata.get("selectCourse").toString(),
            portions: Number(formdata.get("portions")),
            directions: formdata.get("directions").toString(),
            author: sessionStorage.user,
            ingredient_Amounts: ingredientAmountlist,
            ingredient_Names: ingredientNamelist
        };
            console.log(newRecipe);
          


        //.............................//

            
            


           
            let url: string = "http://localhost:8100/createRecipe";
            let query: URLSearchParams = new URLSearchParams(<any>newRecipe);
            url = url + "?" + query.toString();
            let resp: Response = await fetch(url);
            let data: Recipe = await resp.json();
            console.log(data);
            console.log(url);
            



    }   
    
    
        function addIngredientField(): void {
        
        
        
        let newIngredientAmount: HTMLInputElement = document.createElement("input");
        newIngredientAmount.type = "text";
        newIngredientAmount.className = "amount";
        newIngredientAmount.id = "Amount" + ingredientCount ;
        newIngredientAmount.name = "Amount" + ingredientCount ;
        newIngredientAmount.placeholder = "Amount";
        
        let newIngridientName: HTMLInputElement = document.createElement("input");
        newIngridientName.type = "text";
        newIngridientName.className = "ingredient";
        newIngridientName.id = "IngredientName" + ingredientCount;
        newIngridientName.name = "IngredientName" + ingredientCount;
        newIngridientName.placeholder = "Name of Ingredient";
        
        document.getElementById("ingredients").appendChild(newIngredientAmount);
        document.getElementById("ingredients").appendChild(newIngridientName);
        
        ingredientCount++;    
    }
    
    
    
}








}