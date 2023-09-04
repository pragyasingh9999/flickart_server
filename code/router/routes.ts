import { Router, Request, Response } from "express";
import { MongoClient } from "mongodb";


const uri = "mongodb://localHOST:27017";
const client = new MongoClient(uri);
const database = client.db("Credentials");
const info = database.collection("newlogins");
const router = Router();

router.get('/', (req: Request, res: Response)=>{
  res.send(`<html>
  <head>
      <title>Login Page</title>
      <style>

form {
  display: inline-block;
  border: 3px solid skyblue;
}

input[type=text]{
width: 100%;
padding: 12px 20px;
margin: 8px 0;
display: inline-block;
border: 1px solid #ccc;
box-sizing: border-box;
}

input[type=password] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  box-sizing: border-box;
  }

.login-container {
  width: 100%;
  height: 100%;
  padding: 50px;
  border-radius: 4px;
  background-color:  #CF9FFF;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button {
background-color: #04AA6D;
color: white;
padding: 14px 20px;
margin: 8px 0;
border: none;
cursor: pointer;
width: 100%;
}

button:hover {
opacity: 0.8;
}

.cancelbtn {
width: auto;
padding: 10px 18px;
background-color: #f44336;
}

.imgcontainer {
text-align: center;
margin: 24px 0 12px 0;
}

img.avatar {
width: 40%;
border-radius: 50%;
}

.container {
  padding: 16px;
}

span.psw {
float: right;
padding-top: 16px;
}

@media screen and (max-width: 300px) {
span.psw {
  display: block;
  float: none;
}
.cancelbtn {
  width: 100%;
}
}
      </style>
  </head>
  <body>
  <div class="login-container">
      <form method="post" action="/login">
      <div class="imgcontainer">
         <img src="https://t4.ftcdn.net/jpg/01/19/11/55/360_F_119115529_mEnw3lGpLdlDkfLgRcVSbFRuVl6sMDty.jpg" alt="Avtar" class="avtar">
      </div>
          <div class="container">
              <label for="username"><b>Username</b></label>
              <input type="text" placeholder="Enter username" name="username" required>
          </div>
          <div class="container">
              <label for="password"><b>Password</b></label>
              <input type="'password" placeholder="Enter Password" name="password" required>
          </div>
              <button type="submit">Login</button>
              <label>
                  <button type="checkbox" checked="checked" name="rememberMe">Remember Me</button>
              </label>
          
          <div class="container" style="background-color:#f1f1f1">
              <button type="button" class="cancelbtn">Cancel</button>
              <span class="psw">Forgot <a href="#">password?</a></span>
          </div>
      </form>
  </div>
  </body>
</html>`);
});

router.post('/login', async (req: Request, res: Response) => {
  const {username, password} = req.body;
  const query = {"username": username};
  const user = await info.findOne(query);

  if(user){
    const input= user.password;
    if(input == password)
    {
        res.json("successfully logged in");
    }else{
        res.json("wrong password");
    }
  }
  else{
    res.json("invalid userId");
  }
  
}); 

export {router};