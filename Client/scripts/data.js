"use strict";
var KMJ;
(function (KMJ) {
    KMJ.users = [
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
    KMJ.recipes = [{
            title: "ei mit speck",
            author: "jochem",
            portions: 2,
            duration: "12min",
            course: "main",
            ingredients: [
                { amount: "3", name: "eier" },
                { amount: "eine prise", name: "salz" }
            ],
            directions: "1. ei in die pfanne \n 2. ei anbraten \n 3. salz hinzufügen"
        },
        { title: "pfannenkuchen",
            author: "mora",
            portions: 4,
            duration: "20min",
            course: "dessert",
            ingredients: [
                { amount: "3", name: "eier" },
                { amount: "200g", name: "mehl" },
                { amount: "130ml", name: "milch" },
                { amount: "20g", name: "butter" }
            ],
            directions: "1. ei mit milch und mehl verrühren \n 2. butter in pfanne schmelzen \n 3. pfannkuchen backen bis leicht braun" },
        { title: "kuchen",
            author: "jochem",
            portions: 3,
            duration: "20min",
            course: "misc",
            ingredients: [
                { amount: "3", name: "eier" },
                { amount: "200g", name: "mehl" },
                { amount: "130ml", name: "milch" },
                { amount: "20g", name: "butter" }
            ],
            directions: "1. ei mit milch und mehl verrühren \n 2. butter in pfanne schmelzen \n 3. pfannkuchen backen bis leicht braun" },
        {
            title: "ei mit spack",
            author: "jochem234",
            portions: 2,
            duration: "12min",
            course: "starter",
            ingredients: [
                { amount: "3", name: "eier" },
                { amount: "eine prise", name: "salz" }
            ],
            directions: "1. ei in die pfanne \n 2. ei anbraten \n 3. salz hinzufügen"
        }
    ];
})(KMJ || (KMJ = {}));
//# sourceMappingURL=data.js.map