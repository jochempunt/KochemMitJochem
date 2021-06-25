namespace KMJ {


    if (window.location.href.includes("login")) {
        let logInButton: HTMLInputElement = <HTMLInputElement> document.getElementById("logInButton"); 
        logInButton.addEventListener("click", logIn);
       

    } else {
        
        let signupButton: HTMLInputElement = <HTMLInputElement> document.getElementById("signupButton");
        signupButton.addEventListener("click", signUp);
    }
    

    let disclaimerError: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("disclaimer");


    function logIn(): void {
        let formdata: FormData = new FormData(document.forms[0]);
        if (noFieldsEmpty(formdata)) {
            for (let user of users) {
                if (formdata.get("username") == user.name) {
                    if (formdata.get("password") == user.pw) {
                        sessionStorage.user = user.name;
                        disclaimerError.innerText = "Welcome " + user.name;
                        window.location.href = "./Main.html";
                        return;
                    }
                }
    
    
            }
            disclaimerError.innerText = "username or password are wrong";
        } else {
            return;
        }
       
    }


    function noFieldsEmpty(_formData: FormData): boolean {
        for (let entry of _formData) {
            if (entry[1] == "") {
                alert(entry[0] + " is empty, please fill it in...");
                return false;
            }
        }
        return true;
    }



    function signUp(): void {
        let formdata: FormData = new FormData(document.forms[0]);
        if (noFieldsEmpty(formdata)) {
            let username: string = formdata.get("username").toString();
            let pw: string = formdata.get("password").toString();
            let pwRepeat: string = formdata.get("rpPassword").toString();
            if (pw == pwRepeat) {
                disclaimerError.innerText = "welcome " + username;
            } else {
                disclaimerError.innerText = "passwords dont match";
            }
        } else {
            return;
        }
        
    }





}