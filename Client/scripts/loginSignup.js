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
    function logIn() {
        let formdata = new FormData(document.forms[0]);
        if (noFieldsEmpty(formdata)) {
            for (let user of KMJ.users) {
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
        else {
            return;
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
    function signUp() {
        let formdata = new FormData(document.forms[0]);
        if (noFieldsEmpty(formdata)) {
            let username = formdata.get("username").toString();
            let pw = formdata.get("password").toString();
            let pwRepeat = formdata.get("rpPassword").toString();
            if (pw == pwRepeat) {
                disclaimerError.innerText = "welcome " + username;
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