import dotenv from 'dotenv'
import express, { urlencoded } from 'express';
import connectDB from './DB/index.js';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config({
    path: './env'
})
const app = express();

app.use(cors())
app.use(express.json())


connectDB()

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)
 
// const PORT = 3000

// app.get('/api/', (req,res)=>{
//     res.send("Hey i am running on server")
// })

app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email }).exec();

        if (existingUser) {
            res.send({ message: "User already registered" });
        } else {
            const newUser = new User({
                name,
                email,
                password
            });

            await newUser.save();
            res.send({ message: "Successfully Registered" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).exec();

        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successful", user: user });
            } else {
                res.send({ message: "Password didn't match" });
            }
        } else {
            res.send({ message: "User not registered" });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


app.listen(process.env.PORT, ()=>{
    console.log(`app listen on port no ${process.env.PORT}`)
} )  

