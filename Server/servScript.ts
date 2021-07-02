import * as Http from "http";
import * as url from "url";
import * as Mongo from "mongodb";
import { ParsedUrlQuery } from "querystring";
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
    
    interface ServerResponse {
        message: string;
        error: string;
    }
    
    interface Recipe {
        //_id: Mongo.ObjectId;
        title: string;
        author: string;
        portions: number;
        duration: string;
        ingredient_Amounts: string[];
        ingredient_Names: string[];
        directions: string;
        course: string; 
    }



    interface FullRecipe {
        _id: Mongo.ObjectId;
        title: string;
        author: string;
        portions: number;
        duration: string;
        ingredient_Amounts: string[];
        ingredient_Names: string[];
        directions: string;
        course: string; 
    }


    
    let dbURL: string = "mongodb+srv://jochem:punt@kmj.ficq6.mongodb.net/KMJ?retryWrites=true&w=majority";
    let mongoClient: Mongo.MongoClient = undefined;
    
    async function connectToDB(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = {useNewUrlParser: true, useUnifiedTopology: true};
        try {
            mongoClient  = new Mongo.MongoClient(_url, options);
            await mongoClient.connect();
        } catch (error) {
            console.log(error);
        }
        
    }

    connectToDB(dbURL).catch(console.error);
    
    
    
    interface User {
        username: string;
        password: string;
        favorites: string[];
    }
    
    
    
    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        
        //await connectToDB(dbURL);
        
        
        
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.setHeader("content-type", "application/json; charset=utf-8");
        
        console.log("handling request");
        
        let reqUrl: url.UrlWithParsedQuery = url.parse(_request.url, true);
        let  username: string = "";
       
        if (reqUrl.query["username"]) {
            username = reqUrl.query["username"].toString();
        }
        
        
        
        let serverResponse:  ServerResponse = {error: undefined, message: undefined };
        
        
        
        switch (reqUrl.pathname) {
            case "/createUser":
            console.log("creating user");
                
            let newPassword: string = reqUrl.query["password"].toString();    
            _response.write(await createUser(username, newPassword)); 
            break;
            
            case"/logIn":
            let password: string = reqUrl.query["password"].toString();    
            
            
            console.log("prepare to login " + username + " : " + password);
            
            _response.write(await logIn(username, password));
            break;
            case "/getUser":
                console.log("get user: " + username );
                let usersCollection: Mongo.Collection = mongoClient.db("KMJ").collection("Users");
               
             
                let currentuser: User[] = await usersCollection.findOne({username: username});
                
                _response.write( JSON.stringify(currentuser));
            
    
                break;
            
            case"/createRecipe":
            
            console.log("creating recipe");
            _response.write(createRecipe(reqUrl.query));
            break;
            
            case"/editRecipe":
            //let editedR: Recipe = undefined; 
            console.log("editing recipe");
            _response.write(await editRecipe(reqUrl.query));
            break;
            
            case"/favoriteRecipe":
            console.log("favorising recipe of " + username);
            let id: string  = reqUrl.query["id"].toString();
            _response.write(await favoriteRecipe( id, username));
            break;
            
            case"/findRecipes":
            console.log("find recipes");
            let filters: string[] = reqUrl.query["filters"].toString().split(",");
            let page: string = reqUrl.query["page"].toString();
        
            _response.write(await findRecipes(filters, page, username));



            break; 
            
            case"/deleteRecipe":
            console.log(reqUrl.query);
            
            let rID: string = reqUrl.query["id"].toString();
            console.log("deleting recipe");
            _response.write(await deleteRecipe(rID));
            break;    
            
            case "/findOneRecipe":
                console.log("finding one recipe");
                let recipesCollection: Mongo.Collection = mongoClient.db("KMJ").collection("Recipes");
              
                let recepID: Mongo.ObjectId = new Mongo.ObjectId(reqUrl.query["_id"].toString());
                let recipe: Recipe = await  recipesCollection.findOne({_id: recepID});
                _response.write(JSON.stringify(recipe));


                break;
        }
        
        
        
        
        _response.end();
        
        
        
        
        
        async function logIn(_username: string, _password: string): Promise<string> {
            
            let users: Mongo.Collection = mongoClient.db("KMJ").collection("Users");
         
            let user: User = await  users.findOne({username: _username});
            
            if (user && user.password == _password) {
                serverResponse.message = "welcome" + _username;
            } else {
                serverResponse.error = "username or password is wrong";
            }
            return JSON.stringify(serverResponse);
        }
        
        
        async function createUser(_username: string, _password: string): Promise<string> {
            let usersCollection: Mongo.Collection = mongoClient.db("KMJ").collection("Users");
            let cursor: Mongo.Cursor = usersCollection.find({username: _username});
            let users: User[] = await cursor.toArray();
            let usernameTaken: boolean = false;
            console.log("creating user " + _username);
            
            for ( let user of users) {
                if ( _username == user.username) {
                    usernameTaken = true;
                    break;
                }
            }
            if (!usernameTaken) {
                let newUser: User = {username: _username, password: _password, favorites: [""]};
                usersCollection.insertOne(newUser);
                serverResponse.message = "welcome new user: " + _username;
                
            } else {
                serverResponse.error = "username " + _username + " already taken";
            }
            if (cursor) {
                cursor.close();
            }
            return JSON.stringify(serverResponse);
        }
        



        async function findRecipes(_filters: string[], _page: string, _user: string): Promise<string> {
            let recipesCollection: Mongo.Collection = mongoClient.db("KMJ").collection("Recipes");
            let cursor: Mongo.Cursor = undefined;
            let recipeArrayNoFilters: FullRecipe[] = [];

            switch (_page) {
                case "ALL":
                    cursor = recipesCollection.find();
                    recipeArrayNoFilters = await cursor.toArray();
                    break;
                case"MYRECIPES":
                    cursor = recipesCollection.find({author: _user});
                    recipeArrayNoFilters = await cursor.toArray();
                    break;
                case"FAVORITES":
                    let users: Mongo.Collection = mongoClient.db("KMJ").collection("Users");
                 
                    let user: User = await users.findOne({username: _user});
                  
                    if (user) {
                    if (user.favorites) {
                        for (let id of user.favorites ) {
                            if (id != "") {
                                console.log("favorite id is:" + id);
                            
                                let recipeID: Mongo.ObjectId = new Mongo.ObjectId(id.toString());
                           
                            
                                let tempRecipe: FullRecipe = await recipesCollection.findOne({_id: recipeID});
                                if (tempRecipe) {
                                recipeArrayNoFilters[recipeArrayNoFilters.length] = tempRecipe;
                                }
                            }
                        }
                       
                    }
                }

                    break;
            }
            let filteredArray: FullRecipe[] = [];
            for (let filter of _filters ) {
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
        





        async function deleteRecipe(_recipeID: string): Promise<string> {
            console.log("ID= " + _recipeID);
            
            let recipesCollection: Mongo.Collection = mongoClient.db("KMJ").collection("Recipes");
            let recipeID: Mongo.ObjectId = new Mongo.ObjectId(_recipeID);
            await recipesCollection.findOneAndDelete({_id: recipeID});
            serverResponse = {message: "deleted recipe " + _recipeID, error: undefined};
            return JSON.stringify(serverResponse);
        }



        
        async function editRecipe(_urlRecipe: ParsedUrlQuery): Promise<string> { 
            let recipesCollection: Mongo.Collection = mongoClient.db("KMJ").collection("Recipes");
            let amountQuery: string | string[] = _urlRecipe["ingredient_Amounts"];
            let nameQuery: string | string[] = _urlRecipe["ingredient_Names"];
            //console.log(_urlRecipe["ingredient_Names"].toString());
            
            let amounts: string[] = amountQuery.toString().split(",");
            let names: string[] = nameQuery.toString().split(",");
            
            
          
            
            let recipeID: Mongo.ObjectId = new Mongo.ObjectId( _urlRecipe["_id"].toString());

            let newRecipe: FullRecipe = {
                title: _urlRecipe["title"].toString(),
                author: _urlRecipe["author"].toString(),
                duration: _urlRecipe["duration"].toString(),
                course: _urlRecipe["course"].toString(),
                portions: Number( _urlRecipe["portions"].toString()),
                directions: _urlRecipe["directions"].toString(),
                ingredient_Amounts: amounts,
                ingredient_Names: names,
                _id: recipeID 

            };

            try {
                recipesCollection.replaceOne({_id: recipeID}, newRecipe);

                serverResponse = {message: JSON.stringify(newRecipe) + " edited", error: undefined};
            } catch (e) {
                serverResponse = {message: undefined, error: "konnte nicht bearbeitet werden"};
            }
            
            console.log(serverResponse);
            
            return JSON.stringify(serverResponse);

        }




        
        function createRecipe(_urlRecipe: ParsedUrlQuery): string {
            let recipesCollection: Mongo.Collection = mongoClient.db("KMJ").collection("Recipes");
            
            console.log(_urlRecipe);
            
            let amountQuery: string | string[] = _urlRecipe["ingredient_Amounts"];
            let nameQuery: string | string[] = _urlRecipe["ingredient_Names"];
            console.log(_urlRecipe["ingredient_Names"].toString());
            
            let amounts: string[] = amountQuery.toString().split(",");
            let names: string[] = nameQuery.toString().split(",");
           
            let newRecipe: Recipe = {
                                        title: _urlRecipe["title"].toString(),
                                        author: _urlRecipe["author"].toString(),
                                        duration: _urlRecipe["duration"].toString(),
                                        course: _urlRecipe["course"].toString(),
                                        portions: Number( _urlRecipe["portions"].toString()),
                                        directions: _urlRecipe["directions"].toString(),
                                        ingredient_Amounts: amounts,
                                        ingredient_Names: names

                                    };






            recipesCollection.insertOne(newRecipe);

            serverResponse = {message: JSON.stringify(newRecipe) + " inserted", error: undefined};

            return JSON.stringify(serverResponse);
        }
        
        async function favoriteRecipe(_recipeID: string, _username: string ): Promise<string> {
            
            
            
            let usersCollection: Mongo.Collection = mongoClient.db("KMJ").collection("Users");
            let user: User = await  usersCollection.findOne({username: _username});

            let isFavored: boolean = false;
            let position: number = 0;
            for (let favorite of user.favorites) {
                if (favorite == _recipeID) {
                    isFavored = true;
                    break;
                }
                position++;
            }

            if (!isFavored) {
                serverResponse = {message: "added favorite: " + _recipeID , error: undefined};
                user.favorites[user.favorites.length] = _recipeID;
               
            } else {
                serverResponse = {message: "deleted favorite: " + _recipeID , error: undefined};
                user.favorites.splice(position, 1);
            }
            usersCollection.findOneAndUpdate({username: _username}, { $set: {favorites: user.favorites}});
            




            
            
            
            return JSON.stringify(serverResponse);
        }
        
        
        
        
        
        
    }
}
