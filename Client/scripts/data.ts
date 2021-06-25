namespace KMJ {


export interface Recipe {
    title: string;
    author: string;
    portions: number;
    duration: string;
    ingredientAmounts: string[];
    ingredientNames: string[];
    directions: string;
    course: string;
    


}

export interface Ingredient {
    amount: string;
    name: string;
}


export interface User {
    name: string;
    pw: string;
    favorites: string[];
}


export let users: User[] = [
                            {
                                name: "testUser",
                                pw: "1234",
                                favorites: ["ei mit speck", "pfannenkuchen"]
                            },
                            {
                                name: "jochem",
                                pw: "punt",
                                favorites: ["kuchen", "ei mit spack"]
                            }
                            ];






export let recipes: Recipe[] = [{
                                title: "ei mit speck",
                                author: "jochem",
                                portions: 2,
                                duration: "12min",
                                course: "main",
                                ingredientAmounts: [ "3", "eine prise"],
                                ingredientNames: [ "eier", "salz"],
                                /*ingredients: [
                                                {amount: "3", name: "eier"},
                                                {amount: "eine prise", name: "salz"}
                                             ],*/
                                directions: "1. ei in die pfanne \n 2. ei anbraten \n 3. salz hinzufügen"},
                                {title: "pfannenkuchen",
                                author: "mora",
                                portions: 4,
                                duration: "20min",
                                course: "dessert",
                                ingredientAmounts: [ "3", "200g", "130ml", "20g"],
                                ingredientNames: [ "eier", "mehl", "milch", "butter"],
                                directions: "1. ei mit milch und mehl verrühren \n 2. butter in pfanne schmelzen \n 3. pfannkuchen backen bis leicht braun"},
                                {title: "kuchen",
                                author: "jochem",
                                portions: 3,
                                duration: "20min",
                                course: "misc",
                                ingredientAmounts: [ "3", "200g", "130ml", "20g"],
                                ingredientNames: [ "eier", "mehl", "milch", "butter"],
                                directions: "1. ei mit milch und mehl verrühren \n 2. butter in pfanne schmelzen \n 3. pfannkuchen backen bis leicht braun"},
                                {
                                    title: "ei mit spack",
                                    author: "jochem234",
                                    portions: 2,
                                    duration: "12min",
                                    course: "starter",
                                    ingredientAmounts: [ "3", "eine prise"],
                                    ingredientNames: [ "eier", "salz"],
                                    directions: "1. ei in die pfanne \n 2. ei anbraten \n 3. salz hinzufügen"}
                                   
                                ];
}