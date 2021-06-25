import * as Http from "http";
import * as url from "url";
export namespace Server {
    console.log("Starting server");
    let port: number = Number(process.env.PORT);
    if (!port)
        port = 8100;

    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);

    function handleListen(): void {
        console.log("Listening");
    }


    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("I hear voices!");
        
        
        let reqUrl: url.UrlWithParsedQuery = url.parse(_request.url, true);
        
        switch (reqUrl.pathname) {
            case "/createUser":
                break;
            case"/logIn":
                break;
            case"/createRecipe":
                _response.setHeader("content-type", "application/json; charset=utf-8");
                _response.write(JSON.stringify(reqUrl.query));
                break;
            case"/editRecipe":
                break;
            case"/favoriteRecipe":
                break;
            case"findRecipes":
                break;    
        }



        
        
        _response.setHeader("Access-Control-Allow-Origin", "*");
       
        _response.end();
    }
}
