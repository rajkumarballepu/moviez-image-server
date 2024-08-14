const express = require("express");
const bodyParser = require("body-parser")
const path = require("path")
const ejs = require("ejs");
const multer = require("multer");
const fs = require("fs")

const app = express();
const upload = multer({
    storage: multer.diskStorage({
            destination:(req,file,cb)=>{
            cb(null,"public/posters/")
        },
            filename:(req,file,cb)=>{
            cb(null,`${file.originalname}`)
        }
    }),
    fileFilter:(req,file,cb)=>{
        const allowedFileType = ["jpg", "jpeg", "png"];
        if(allowedFileType.includes(file.mimetype.split("/")[1])){
            cb(null,true)
        }else{
            cb(null,false)
        }
    }
})

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.listen(3000, ()=> {
    console.log("Server started")
    console.log("Link : "+" http://localhost:3000")
})

app.get("/file/upload",(req, res)=> {
    res.render("index")
})

app.post("/file/upload", upload.array("images"),(req, res)=> {
    console.log(req.files)
    res.json({file: req.file})
})

app.get("/file/images/:name", (req, res)=> {
    const name = req.params.name;
    console.log(fs.existsSync(`public/posters/${name}.jpg`))
    if(fs.existsSync(`public/posters/${name}.jpg`)) {
        res.sendFile(name+".jpg", {root: path.join(__dirname, "public/posters")})
    } else {
        res.json({stutus: 400, message: "File not found"})
    }
})