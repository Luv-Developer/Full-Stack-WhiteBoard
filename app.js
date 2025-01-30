const express = require("express")
const app = express()
const PORT = 3000
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const path = require("path")
const cookieParser = require("cookie-parser")
const {createClient} = require("@supabase/supabase-js")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")
app.use(cookieParser())

//Creating the database connection 
const supabaseurl = 'https://tgulchyaoxlspxdnthcp.supabase.co'
const supabasekey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndWxjaHlhb3hsc3B4ZG50aGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNTk4OTcsImV4cCI6MjA1MzYzNTg5N30.-zMQ8YctfJQSZ-aFLc5sYoHTAxpiVsw-gY8jm8xOO58'
const supabase = createClient(supabaseurl,supabasekey)

//Routes
app.get("/",(req,res)=>{
    res.render("homepage")
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register",async(req,res)=>{
    const {username,email,password} = req.body
    let salt = await bcrypt.genSalt(10)
    let hashedpassword = await bcrypt.hash(password,salt)
    let user = await supabase
    .from("users2")
    .insert([{username,email,password_hash:hashedpassword}])
    if(user){
        let token = jwt.sign({email},"hehe")
        res.cookie("token",token)
        res.render("homepage")
    }
    else{
        res.render("register")
    }
})
app.get("/login",(req,res)=>{
    res.render("login")
})
app.post("/login",async(req,res)=>{
    const {email,password} = req.body
    let {data:user,error} = await supabase
    .from("users2")
    .select("*")
    .eq("email",email)
    .single()
    if(!user){
       return res.redirect("/register")
    }
        const ispasswordvalid = await bcrypt.compare(password,user.password_hash)
        if(!ispasswordvalid){
            return res.redirect("/login")
        }
         let token = jwt.sign({email},"hehe")
         res.cookie("token",token)
           return res.redirect("/")
 })
 function isloggedin(req,res,next){
    if(req.cookies.token===""){
        res.redirect("/login")
        next()
    }
    else{
    let data = jwt.verify(req.cookies.token,"hehe")
    req.user = data
    next()
    }
}
app.get("/whiteboard",isloggedin,async(req,res)=>{
    let user = await supabase
    .from("users2")
    .select("*")
    .eq("email",req.user.email)
    .single()
    res.render("whiteboard",{user})
})
app.get("/logout",(req,res)=>{
    res.cookie("token","")
    res.redirect("login")
})
app.listen(PORT,()=>{
    console.log(`App is listening at ${PORT}`)
})

