namespace KMJ {
    
    
    // in currentrecipe wird das zu editierende rezept gespeichert.
    let currentRecipe: Recipe = undefined;
    
    
    
    let ingredientCount: number = 2;

    function addIngredientField(): void {
    
    
    
        let newIngredientAmount: HTMLInputElement = document.createElement("input");
        newIngredientAmount.type = "text";
        newIngredientAmount.className = "amount";
        newIngredientAmount.id = "Amount" + ingredientCount ;
        newIngredientAmount.name = "Amount";
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



    if (sessionStorage.editRecipeId != "") {     // angeklicktes/ausgewähltes rezept wird aus der datenbank geladen
        console.log("editRecipe=" + sessionStorage.editRecipeId);
        getOneRecipe(sessionStorage.editRecipeId).then(edit);
        

        async function getOneRecipe(_searchID: string): Promise<void> {
            //let url: string = "http://localhost:8100/findOneRecipe";
            let url: string = "https://kochem-mit-jochem.herokuapp.com/findOneRecipe";
            url = url + "?_id=" + _searchID ;
            let resp: Response = await fetch(url);
            currentRecipe = await resp.json();
        }
        
        
        //------------------------ edit ---------------------------//
        function edit(): void {
            
            
            // zuerst wird das zu editierende rezept in die jeweiligen formularfelder geladen
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
            
            
            // die ingredientfelder sind variabel dh. muss dies mit einer schleife gelöst werden
            let ingredientCount: number = currentRecipe.ingredient_Amounts.length;
            



            for (let i: number = 0; i < ingredientCount; i ++) {
                if (i >= 2) { //es sind immer mindestens 2 lehre ingredient felder auf der seite
                    addIngredientField();
                    
                } 
                
                let amountInput: HTMLInputElement = <HTMLInputElement> document.getElementById("Amount" + i);
                amountInput.value = currentRecipe.ingredient_Amounts[i];
                
                let ingredientInput: HTMLInputElement  = <HTMLInputElement>document.getElementById("IngredientName" + i);
                ingredientInput.value = currentRecipe.ingredient_Names[i];
                
            }
            
        }
    }
    
    
    
    // egal ob editiert oder ein neues rezept erstellt wird, es braucht immer diese 2 elemente
    
    let finishButton: HTMLDivElement = <HTMLDivElement> document.getElementById("finishButtonMobile");
    finishButton.addEventListener("click", getRecipeOfForm);
    
    let plusIngredient: HTMLDivElement = <HTMLDivElement> document.getElementById("plusIngredient");
    plusIngredient.addEventListener("click", addIngredientField);
    
    
    
    
    // funktion, welche das eingegebene in ein objekt von "recipe" einliest
    async function getRecipeOfForm(): Promise<void> {
        let formdata: FormData = new FormData(document.forms[0]);
        
        
        
        
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
      
        
        
        let newRecipe: RecipeFull = {title: formdata.get("recipeTitle").toString(),
        duration: formdata.get("duration").toString(),
        course: formdata.get("selectCourse").toString(),
        portions: Number(formdata.get("portions")),
        directions: formdata.get("directions").toString(),
        author: sessionStorage.user,
        ingredient_Amounts: ingredientAmountlist,
        ingredient_Names: ingredientNamelist,
        _id: sessionStorage.editRecipeId
        };
       
    
    
    
    //..........send to database...................//
        
        
        let url: string = "";
        if (sessionStorage.editRecipeId != "") {
     
         
        //url = "http://localhost:8100/editRecipe";  
        url = "https://kochem-mit-jochem.herokuapp.com/editRecipe";  
        } else {
        //url = "http://localhost:8100/createRecipe";
        url = "https://kochem-mit-jochem.herokuapp.com/createRecipe";
        }
    
    
    
        let query: URLSearchParams = new URLSearchParams(<any>newRecipe);
        url = url + "?" + query.toString();
        let resp: Response = await fetch(url);
        let data: string = await resp.json();
        console.log(data);
    
    
        window.location.href = "./Main.html";
    
    
    
    }   


}




















