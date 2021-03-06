namespace KMJ {


//klasse für die bereitstellung aller interfaces & ehemalige test daten


export interface Recipe {
    title: string;
    author: string;
    portions: number;
    duration: string;
    ingredient_Amounts: string[];
    ingredient_Names: string[];
    directions: string;
    course: string;
    
}


export interface RecipeFull {
    title: string;
    author: string;
    portions: number;
    duration: string;
    ingredient_Amounts: string[];
    ingredient_Names: string[];
    directions: string;
    course: string;
    _id: string;
    
}


export interface Ingredient {
    amount: string;
    name: string;
}


export interface User {
    username: string;
    pw: string;
    favorites: string[];
}







export let users: User[] = [
                            {
                                username: "testUser",
                                pw: "1234",
                                favorites: ["ei mit speck", "pfannenkuchen"]
                            },
                            {
                                username: "jochem",
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
                                ingredient_Amounts: [ "3", "eine prise"],
                                ingredient_Names: [ "eier", "salz"],
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
                                ingredient_Amounts: [ "3", "200g", "130ml", "20g"],
                                ingredient_Names: [ "eier", "mehl", "milch", "butter"],
                                directions: "1. ei mit milch und mehl verrühren \n 2. butter in pfanne schmelzen \n 3. pfannkuchen backen bis leicht braun"},
                                {title: "kuchen",
                                author: "jochem",
                                portions: 3,
                                duration: "20min",
                                course: "misc",
                                ingredient_Amounts: [ "3", "200g", "130ml", "20g"],
                                ingredient_Names: [ "eier", "mehl", "milch", "butter"],
                                directions: "1. ei mit milch und mehl verrühren \n 2. butter in pfanne schmelzen \n 3. pfannkuchen backen bis leicht braun"},
                                {
                                    title: "ei mit spack",
                                    author: "jochem234",
                                    portions: 2,
                                    duration: "12min",
                                    course: "starter",
                                    ingredient_Amounts: [ "3", "eine prise"],
                                    ingredient_Names: [ "eier", "salz"],
                                    directions: "1. ei in die pfanne \n 2. ei anbraten \n 3. salz hinzufügen"}
                                   
                                ];
}