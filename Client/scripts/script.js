"use strict";
var KMJ;
(function (KMJ) {
    /*   enum Page {
        ALL, FAVORITE, MYRECIPES
    }  */
    let navicons = document.querySelectorAll("nav i");
    for (let ico of navicons) {
        if (ico.id) {
            ico.addEventListener("click", changePage);
        }
    }
    console.log(sessionStorage.currentP);
    if (sessionStorage.currentP == "MYRECIPES") {
        console.log("ja");
    }
    switch (sessionStorage.currentP) {
        case "FAVORITES":
            document.getElementById("faveIcon").click();
            break;
        case "MYRECIPES":
            document.getElementById("myIcon").click();
        case "ALL":
            document.getElementById("allIcon").click();
            break;
    }
    function changePage(_event) {
        let siteTitle = document.getElementById("site_title");
        let icon = undefined;
        let clickedIcon = _event.target;
        switch (clickedIcon.id) {
            case "allIcon":
                siteTitle.innerText = "All Recipes";
                icon = document.getElementById("allIcon");
                sessionStorage.currentP = "ALL";
                break;
            case "faveIcon":
                siteTitle.innerText = "Favorites";
                icon = document.getElementById("faveIcon");
                sessionStorage.currentP = "FAVORITES";
                break;
            case "myIcon":
                siteTitle.innerText = "My Recipes";
                sessionStorage.currentP = "MYRECIPES";
                icon = document.getElementById("myIcon");
                break;
        }
        for (let ico of navicons) {
            ico.className = ico.className.replace("currentIcon", "");
        }
        icon.className = icon.className + " currentIcon";
    }
})(KMJ || (KMJ = {}));
//# sourceMappingURL=script.js.map