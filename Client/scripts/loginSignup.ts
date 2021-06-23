namespace KMJ {

    let logInButton: HTMLInputElement = <HTMLInputElement> document.getElementById("logInButton"); 
    logInButton.addEventListener("click", logIn);


    let disclaimerError: HTMLParagraphElement = <HTMLParagraphElement> document.getElementById("disclaimer");



    function logIn(): void {
        let formdata: FormData = new FormData(document.forms[0]);

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




    }







}