"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const Http = require("http");
const url = require("url");
const Mongo = require("mongodb");
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
    let dbURL = "mongodb+srv://jochem:punt@kmj.ficq6.mongodb.net/KMJ?retryWrites=true&w=majority";
    let mongoClient = undefined;
    async function connectToDB(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
    }
    async function handleRequest(_request, _response) {
        await connectToDB(dbURL);
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "application/json; charset=utf-8");
        console.log("handling request");
        let reqUrl = url.parse(_request.url, true);
        let username = "";
        if (reqUrl.query["username"]) {
            username = reqUrl.query["username"].toString();
        }
        let serverResponse = { error: undefined, message: undefined };
        switch (reqUrl.pathname) {
            case "/createUser":
                console.log("creating user");
                let newPassword = reqUrl.query["password"].toString();
                _response.write(await createUser(username, newPassword));
                break;
            case "/logIn":
                let password = reqUrl.query["password"].toString();
                console.log("prepare to login " + username + " : " + password);
                _response.write(await logIn(username, password));
                break;
            case "/getUser":
                console.log("get user: " + username);
                let usersCollection = mongoClient.db("KMJ").collection("Users");
                let currentuser = await usersCollection.findOne({ username: username });
                _response.write(JSON.stringify(currentuser));
                break;
            case "/createRecipe":
                console.log("creating recipe");
                _response.write(createRecipe(reqUrl.query));
                break;
            case "/editRecipe":
                //let editedR: Recipe = undefined; 
                console.log("editing recipe");
                _response.write(await editRecipe(reqUrl.query));
                break;
            case "/favoriteRecipe":
                console.log("favorising recipe of " + username);
                let id = reqUrl.query["id"].toString();
                _response.write(await favoriteRecipe(id, username));
                break;
            case "/findRecipes":
                console.log("find recipes");
                let filters = reqUrl.query["filters"].toString().split(",");
                let page = reqUrl.query["page"].toString();
                _response.write(await findRecipes(filters, page, username));
                break;
            case "/deleteRecipe":
                console.log(reqUrl.query);
                let rID = reqUrl.query["id"].toString();
                console.log("deleting recipe");
                _response.write(await deleteRecipe(rID));
                break;
            case "/findOneRecipe":
                console.log("finding one recipe");
                let recipesCollection = mongoClient.db("KMJ").collection("Recipes");
                let recepID = new Mongo.ObjectId(reqUrl.query["_id"].toString());
                let recipe = await recipesCollection.findOne({ _id: recepID });
                _response.write(JSON.stringify(recipe));
                break;
        }
        _response.end();
        async function logIn(_username, _password) {
            let users = mongoClient.db("KMJ").collection("Users");
            let user = await users.findOne({ username: _username });
            if (user && user.password == _password) {
                serverResponse.message = "welcome" + _username;
            }
            else {
                serverResponse.error = "username or password is wrong";
            }
            return JSON.stringify(serverResponse);
        }
        async function createUser(_username, _password) {
            let usersCollection = mongoClient.db("KMJ").collection("Users");
            let cursor = usersCollection.find({ username: _username });
            let users = await cursor.toArray();
            let usernameTaken = false;
            for (let user of users) {
                if (_username == user.username) {
                    usernameTaken = true;
                    break;
                }
            }
            if (!usernameTaken) {
                let newUser = { username: _username, password: _password, favorites: [""] };
                usersCollection.insertOne(newUser);
                serverResponse.message = "welcome new user: " + _username;
            }
            else {
                serverResponse.message = "username already taken";
            }
            if (cursor) {
                cursor.close();
            }
            return JSON.stringify(serverResponse);
        }
        async function findRecipes(_filters, _page, _user) {
            let recipesCollection = mongoClient.db("KMJ").collection("Recipes");
            let cursor = undefined;
            let recipeArrayNoFilters = [];
            switch (_page) {
                case "ALL":
                    cursor = recipesCollection.find();
                    recipeArrayNoFilters = await cursor.toArray();
                    break;
                case "MYRECIPES":
                    cursor = recipesCollection.find({ author: _user });
                    recipeArrayNoFilters = await cursor.toArray();
                    break;
                case "FAVORITES":
                    let users = mongoClient.db("KMJ").collection("Users");
                    let user = await users.findOne({ username: _user });
                    if (user) {
                        if (user.favorites) {
                            for (let id of user.favorites) {
                                if (id != "") {
                                    console.log("favorite id is:" + id);
                                    let recipeID = new Mongo.ObjectId(id.toString());
                                    let tempRecipe = await recipesCollection.findOne({ _id: recipeID });
                                    if (tempRecipe) {
                                        recipeArrayNoFilters[recipeArrayNoFilters.length] = tempRecipe;
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            let filteredArray = [];
            for (let filter of _filters) {
                for (let recipe of recipeArrayNoFilters) {
                    if (recipe.course == filter) {
                        filteredArray[filteredArray.length] = recipe;
                    }
                }
            }
            if (cursor) {
                cursor.close();
            }
            return JSON.stringify(filteredArray);
        }
        async function deleteRecipe(_recipeID) {
            console.log("ID= " + _recipeID);
            let recipesCollection = mongoClient.db("KMJ").collection("Recipes");
            let recipeID = new Mongo.ObjectId(_recipeID);
            await recipesCollection.findOneAndDelete({ _id: recipeID });
            serverResponse = { message: "deleted recipe " + _recipeID, error: undefined };
            return JSON.stringify(serverResponse);
        }
        async function editRecipe(_urlRecipe) {
            let recipesCollection = mongoClient.db("KMJ").collection("Recipes");
            let amountQuery = _urlRecipe["ingredient_Amounts"];
            let nameQuery = _urlRecipe["ingredient_Names"];
            //console.log(_urlRecipe["ingredient_Names"].toString());
            let amounts = amountQuery.toString().split(",");
            let names = nameQuery.toString().split(",");
            let recipeID = new Mongo.ObjectId(_urlRecipe["_id"].toString());
            let newRecipe = {
                title: _urlRecipe["title"].toString(),
                author: _urlRecipe["author"].toString(),
                duration: _urlRecipe["duration"].toString(),
                course: _urlRecipe["course"].toString(),
                portions: Number(_urlRecipe["portions"].toString()),
                directions: _urlRecipe["directions"].toString(),
                ingredient_Amounts: amounts,
                ingredient_Names: names,
                _id: recipeID
            };
            try {
                recipesCollection.replaceOne({ _id: recipeID }, newRecipe);
                serverResponse = { message: JSON.stringify(newRecipe) + " edited", error: undefined };
            }
            catch (e) {
                serverResponse = { message: undefined, error: "konnte nicht bearbeitet werden" };
            }
            console.log(serverResponse);
            return JSON.stringify(serverResponse);
        }
        function createRecipe(_urlRecipe) {
            let recipesCollection = mongoClient.db("KMJ").collection("Recipes");
            console.log(_urlRecipe);
            let amountQuery = _urlRecipe["ingredient_Amounts"];
            let nameQuery = _urlRecipe["ingredient_Names"];
            console.log(_urlRecipe["ingredient_Names"].toString());
            let amounts = amountQuery.toString().split(",");
            let names = nameQuery.toString().split(",");
            let newRecipe = {
                title: _urlRecipe["title"].toString(),
                author: _urlRecipe["author"].toString(),
                duration: _urlRecipe["duration"].toString(),
                course: _urlRecipe["course"].toString(),
                portions: Number(_urlRecipe["portions"].toString()),
                directions: _urlRecipe["directions"].toString(),
                ingredient_Amounts: amounts,
                ingredient_Names: names
            };
            recipesCollection.insertOne(newRecipe);
            serverResponse = { message: JSON.stringify(newRecipe) + " inserted", error: undefined };
            return JSON.stringify(serverResponse);
        }
        async function favoriteRecipe(_recipeID, _username) {
            let usersCollection = mongoClient.db("KMJ").collection("Users");
            let user = await usersCollection.findOne({ username: _username });
            let isFavored = false;
            let position = 0;
            for (let favorite of user.favorites) {
                if (favorite == _recipeID) {
                    isFavored = true;
                    break;
                }
                position++;
            }
            if (!isFavored) {
                serverResponse = { message: "added favorite: " + _recipeID, error: undefined };
                user.favorites[user.favorites.length] = _recipeID;
            }
            else {
                serverResponse = { message: "deleted favorite: " + _recipeID, error: undefined };
                user.favorites.splice(position, 1);
            }
            usersCollection.findOneAndUpdate({ username: _username }, { $set: { favorites: user.favorites } });
            return JSON.stringify(serverResponse);
        }
    }
})(Server = exports.Server || (exports.Server = {}));
//# sourceMappingURL=servScript.js.map