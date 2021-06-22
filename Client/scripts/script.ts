namespace KMJ {
    
    
    /*   enum Page {
        ALL, FAVORITE, MYRECIPES
    }  */
    
       
        document.getElementById("allIcon").click();
        
    
    
    
        let navicons: NodeListOf<HTMLElement>  = document.querySelectorAll("nav i");
        for (let ico of navicons) {
        if (ico.id) {
            ico.addEventListener("click", changePage);
            console.log(ico.id);
            console.log("1");
        }
        
        
    }
    
    
    
        function changePage(_event: Event): void {
        let siteTitle: HTMLHeadingElement = <HTMLHeadingElement> document.getElementById("site_title");
        let icon: HTMLHtmlElement = undefined;
        
        let clickedIcon: HTMLElement = <HTMLElement>_event.target;
        switch (clickedIcon.id) {
            case "allIcon":
            siteTitle.innerText = "All Recipes";
            icon = <HTMLHtmlElement> document.getElementById("allIcon");
            sessionStorage.currentP = "ALL";
            break;
            case "faveIcon":
            siteTitle.innerText = "Favorites";
            icon = <HTMLHtmlElement> document.getElementById("faveIcon");
            sessionStorage.currentP = "FAVORITES";
            break;
            case "myIcon":
            siteTitle.innerText = "My Recipes";
            sessionStorage.currentP = "MYRECIPES";
            icon = <HTMLHtmlElement> document.getElementById("myIcon");
            break;
        }
        
        for (let ico of navicons) {
            ico.className = ico.className.replace("currentIcon", "");
        }    
        icon.className = icon.className + " currentIcon";
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}