import * as express from "express";
const { newLogin, cartItems } = require("./mongo")
const secretKey = require("./secretKey");
const jwt = require('jsonwebtoken');
import { VerifyErrors } from 'jsonwebtoken';
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 8000;

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Authorization, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {

});



app.post('/login', async (req, res) => {
    const { userID, password } = req.body;
    try {

        const user = await newLogin.findOne({ userID: userID })

        if (user) {
            if (user.password === password) {
                const token = jwt.sign({ userID: user.userID, name: user.name }, secretKey);

                const response = {
                    data1: user.name,
                    data2: token
                }
                res.json(response);
            }
            else {
                res.json("Invalid password")
            }
        }
        else {
            res.json("User does not exist")
        }

    } catch (e) {
        console.log(e);
    }
});

app.post('/signup', async (req, res) => {
    const { name, email, userID, password, repassword } = req.body;

    const data = {
        name: name,
        email: email,
        userID: userID,
        password: password,
        repassword: repassword,
    }

    try {
        const user = await newLogin.findOne({ userID: userID });

        if (user) {
            res.json("user alredy exists");
            console.log(user)
        }
        else {
            await newLogin.insertMany([data]);
            res.json("User successfully registered")
        }
    } catch (e) {
        console.log(e);
    }
});

app.post('/', async (req, res) => {
    const url = `https://fakestoreapi.com/products`;
    const response = await fetch(url);
    const resJson = await response.json();
    res.json(resJson);
})


app.post('/cart', async (req, res) => {

    var userID = "";
    const authHeader = req.headers['authorization'];
    const token = req.query.token || (authHeader && authHeader.split(' ')[1]);

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: any) => {
        if (err) {

            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        userID = decoded.userID;
    });

    const usercart = await cartItems.findOne({ userID: userID })

    if (usercart) {
        return res.json(usercart.items);
    }
    else {
        res.json("empty cart");
    }

})


app.post('/addtocart', async (req, res) => {
    var userID = "";
    const authHeader = req.headers['authorization'];
    const token = req.query.token || (authHeader && authHeader.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        userID = decoded.userID;
    })
    const item = req.body.item;
    const usercart = await cartItems.findOne({ userID: userID })

    const data = {
        userID: userID,
        items: item
    }

    if (usercart) {
        usercart.items.push(item);
        await usercart.save();
    }
    else {
        await cartItems.insertMany([data]);
    }
    res.json("success");
})

app.post('/men', async (req, res) => {
    const url = `https://fakestoreapi.com/products/category/men's%20clothing`;
    const response = await fetch(url);
    const resJson = await response.json();
    res.json(resJson);
})

app.post('/women', async (req, res) => {
    const url = `https://fakestoreapi.com/products/category/women's%20clothing`;
    const response = await fetch(url);
    const resJson = await response.json();
    res.json(resJson);
})

app.post('/jewellery', async (req, res) => {
    const url = `https://fakestoreapi.com/products/category/jewelery`;
    const response = await fetch(url);
    const resJson = await response.json();
    res.json(resJson);
})

app.post('/removefromcart', async (req, res) => {
    const id = req.body;
    var userID = "";
    const authHeader = req.headers['authorization'];
    const token = req.query.token || (authHeader && authHeader.split(' ')[1]);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        userID = decoded.userID;
    })

    const uri = 'mongodb://localhost:27017'; // Your MongoDB URI
    const client = new MongoClient(uri);

    const usercart = await cartItems.findOne({ userID: userID })
    console.log(usercart);

    const itemtodelete= await usercart.items.findOne({id:id});
    console.log(itemtodelete);
    
    try {

        await client.connect();
        const database = client.db('Credentials');
        const collection = database.collection('cartitems');
        const query = { "userID": userID };
        
        const update = {
            $pull: { items: { "id": id} }
        };

        const result = await collection.updateOne(query, update);
        

        if (result.modifiedCount === 1) {
            console.log('Object removed from array');
        } else {
            console.log('Object not found in array');
        }

    } catch (error) {
        console.error('An error occurred:', error);
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
