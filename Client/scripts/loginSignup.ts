namespace KMJ {


    if (window.location.href.includes("login")) {
        let logInButton: HTMLInputElement = <HTMLInputElement> document.getElementById("logInButton"); 
        logInButton.addEventListener("click", logIn);
       

    } else {
        
        let signupButton: HTMLInputElement = <HTMLInputElement> document.getElementById("signupButton");
        signupButton.addEventListener("click", signUp);
    }
    

    let disclaimerError: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("disclaimer");




    interface SendUser {
        username: string;
        password: string;
    }

    export interface ServerResponse {
        message: string;
        error: string;
    }

    let header: HTMLElement = document.getElementById("header");



    async function logIn(): Promise<void> {
        header.className = "loading";
        let formdata: FormData = new FormData(document.forms[0]);
        if (noFieldsEmpty(formdata)) {
            
            let inputUsername: string = formdata.get("username").toString();

            let user: SendUser = {username: inputUsername , password: formdata.get("password").toString()};
            
            
            //let url: string = "http://localhost:8100/logIn";
            let url: string = "https://kochem-mit-jochem.herokuapp.com/logIn";
            let query: URLSearchParams = new URLSearchParams(<any>user);
            url = url + "?" + query.toString();
            let resp: Response = await fetch(url);
            let responseL: ServerResponse = await resp.json();
            
            if (responseL.error == undefined) {
                console.log(responseL.message);
                
                sessionStorage.user = inputUsername;
                header.className = "";
                disclaimerError.innerText = "Welcome " + inputUsername;
                window.location.href = "./Main.html";
            } else {
                header.className = "error";
                disclaimerError.innerText = responseL.error;
            }
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



    async function signUp(): Promise<void> {
        header.className = "loading";
        let formdata: FormData = new FormData(document.forms[0]);
        if (noFieldsEmpty(formdata)) {
            let newUsername: string = formdata.get("username").toString();
            console.log("user: " + newUsername);
            
            let pw: string = formdata.get("password").toString();
            let pwRepeat: string = formdata.get("rpPassword").toString();
            if (pw == pwRepeat) {
                
                let newUser: SendUser = {username: newUsername , password: pw};
               
               
                //let url: string = "http://localhost:8100/createUser";
                let url: string = "https://kochem-mit-jochem.herokuapp.com/createUser";

                let query: URLSearchParams = new URLSearchParams(<any>newUser);
                url = url + "?" + query.toString();
                let resp: Response = await fetch(url);
                let responseL: ServerResponse = await resp.json();
                
                if (responseL.error == undefined) {
                    console.log(responseL.message);
                    
                    sessionStorage.user = newUsername;
                    header.className = "";
                    disclaimerError.innerText = "Welcome " + newUsername;
                    //disclaimerError.innerText = responseL.error;
                    window.location.href = "./login.html";
                } else {
                    disclaimerError.innerText = responseL.error;
                    header.className = "error";
                }



            } else {
                header.className = "error";
                disclaimerError.innerText = "passwords dont match";
            }
        } else {
            return;
        }
        
    }





}