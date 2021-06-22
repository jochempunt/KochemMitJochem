namespace KMJ {


export interface Recipe {
    title: string;
    author: string;
    portions: number;
    duration: string;
    ingredients: Ingredient[];
    directions: string;
    course: string;
    


}

export interface Ingredient {
    amount: string;
    name: string;
}




export let recipes: Recipe[] = [{
                                title: "ei mit speck",
                                author: "jochem24",
                                portions: 2,
                                duration: "12min",
                                course: "main",
                                ingredients: [
                                                {amount: "3", name: "eier"},
                                                {amount: "eine prise", name: "salz"}
                                             ],
                                directions: "1. ei in die pfanne,2. ei anbraten, 2. salz hinzufügen"},
                                {title: "pfannenkuchen",
                                author: "mora",
                                portions: 4,
                                duration: "20min",
                                course: "dessert",
                                ingredients: [
                                                {amount: "3", name: "eier"},
                                                {amount: "200g", name: "mehl"},
                                                {amount: "130ml", name: "milch"},
                                                {amount: "20g", name: "butter"}
                                             ],
                                directions: "1. ei mit milch und mehl verrühren ,2. butter in pfanne schmelzen, 3. pfannkuchen backen bis leicht braun"}
                                ];
}