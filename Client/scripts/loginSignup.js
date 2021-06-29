"use strict";
var KMJ;
(function (KMJ) {
    if (window.location.href.includes("login")) {
        let logInButton = document.getElementById("logInButton");
        logInButton.addEventListener("click", logIn);
    }
    else {
        let signupButton = document.getElementById("signupButton");
        signupButton.addEventListener("click", signUp);
    }
    let disclaimerError = document.getElementById("disclaimer");
    async function logIn() {
        let formdata = new FormData(document.forms[0]);
        if (noFieldsEmpty(formdata)) {
            let inputUsername = formdata.get("username").toString();
            let user = { username: inputUsername, password: formdata.get("password").toString() };
            let url = "http://localhost:8100/logIn";
            let query = new URLSearchParams(user);
            url = url + "?" + query.toString();
            let resp = await fetch(url);
            let responseL = await resp.json();
            if (responseL.error == undefined) {
                console.log(responseL.message);
                sessionStorage.user = inputUsername;
                disclaimerError.innerText = "Welcome " + inputUsername;
                window.location.href = "./Main.html";
            }
            else {
                disclaimerError.innerText = responseL.error;
            }
        }
    }
    function noFieldsEmpty(_formData) {
        for (let entry of _formData) {
            if (entry[1] == "") {
                alert(entry[0] + " is empty, please fill it in...");
                return false;
            }
        }
        return true;
    }
    async function signUp() {
        let formdata = new FormData(document.forms[0]);
        if (noFieldsEmpty(formdata)) {
            let newUsername = formdata.get("username").toString();
            let pw = formdata.get("password").toString();
            let pwRepeat = formdata.get("rpPassword").toString();
            if (pw == pwRepeat) {
                let newUser = { username: newUsername, password: pw };
                let url = "http://localhost:8100/createUser";
                let query = new URLSearchParams(newUser);
                url = url + "?" + query.toString();
                let resp = await fetch(url);
                let responseL = await resp.json();
                if (responseL.error == undefined) {
                    console.log(responseL.message);
                    sessionStorage.user = newUsername;
                    disclaimerError.innerText = "Welcome " + newUsername;
                    window.location.href = "./login.html";
                }
                else {
                    disclaimerError.innerText = responseL.error;
                }
            }
            else {
                disclaimerError.innerText = "passwords dont match";
            }
        }
        else {
            return;
        }
    }
})(KMJ || (KMJ = {}));
//# sourceMappingURL=loginSignup.js.map