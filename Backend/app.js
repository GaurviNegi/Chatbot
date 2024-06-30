 
import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors" 
dotenv.config();

const openai = new OpenAI({
    apiKey:process.env.OPENAI_SECRET_KEY
});

const corsOptions = {
    origin:['http://localhost:5174','http://localhost:5173']
}
//!express logic 
const app = express();
const PORT = process.env.PORT || 9090;

//!middlewares..
app.use(express.json())
app.use(cors(corsOptions));

//!global array to store the history of conversations
const conversationHistory = [{role:"system", content:"you are a helpful assistant"}]
//! routes .....
app.post("/ask",async(req, res)=>{
  
    const userMessage = req.body.message;
    console.log(userMessage)
    //updating conversationHistory with each request
    conversationHistory.push({role:"user",content:userMessage});
   
    //creating the model
    try {
        console.log(conversationHistory);
        const completion = await openai.chat.completions.create({
            messages:conversationHistory,
            model:"gpt-3.5-turbo"
        });
        console.log(completion.choices[0].message);
        //response
        const botResponse = completion.choices[0].message.content;
        res.json({
            message:botResponse
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:" some error ocuured by OpenAI module"
        })
    }
});
app.listen(PORT,()=>{
    console.log(`listening at port number ${PORT}`);
});



