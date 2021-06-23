"use strict";
var KMJ;
(function (KMJ) {
    let logInButton = document.getElementById("logInButton");
    logInButton.addEventListener("click", logIn);
    let disclaimerError = document.getElementById("disclaimer");
    function logIn() {
        let formdata = new FormData(document.forms[0]);
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
})(KMJ || (KMJ = {}));
//# sourceMappingURL=loginSignup.js.map