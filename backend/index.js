const express = require('express');
const app = express();
const cors = require('cors');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    return res.json({hello : "world"});
})

app.post("/run",async(req,res)=>{
    const {language = "cpp", code} = req.body;
    if(code === undefined){
        return res.status(400).json({success: false, error:"empty code detected"});
    }
    try{
        const filepath = await generateFile(language,code);
        const output = await executeCpp(filepath);
        console.log(output);
        return res.json({filepath,output});
    }catch(err){
        return  res.status(500).json({error:`${err}` });
    }
})

app.listen(5500,()=>{
    console.log("Server started");
})