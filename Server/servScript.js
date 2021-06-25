"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const Http = require("http");
const url = require("url");
var Server;
(function (Server) {
    console.log("Starting server");
    let port = Number(process.env.PORT);
    if (!port)
        port = 8100;
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);
    function handleListen() {
        console.log("Listening");
    }
    function handleRequest(_request, _response) {
        console.log("I hear voices!");
        let reqUrl = url.parse(_request.url, true);
        switch (reqUrl.pathname) {
            case "/createUser":
                break;
            case "/logIn":
                break;
            case "/createRecipe":
                _response.setHeader("content-type", "application/json; charset=utf-8");
                _response.write(JSON.stringify(reqUrl.query));
                break;
            case "/editRecipe":
                break;
            case "/favoriteRecipe":
                break;
            case "findRecipes":
                break;
        }
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.end();
    }
})(Server = exports.Server || (exports.Server = {}));
//# sourceMappingURL=servScript.js.map