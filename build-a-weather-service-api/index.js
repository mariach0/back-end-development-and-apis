import express from 'express'
import weatherRouter from './weather.js'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname , "public")))

app.get('/' , (req,res)=> {
    res.status(200)
    res.sendFile(path.join(__dirname , "public" , "index.html"))
})

app.get('/api/info' , (req,res)=> {
    res.json({
        "name" : "Weather Service API"?
        "version" : "1.0.0" , 
        "endpoints" : [
            "/api/data" , "/api/greet" , "/api/weather/:city"
        ]
    })
})

app.get('/docs' , (req,res)=> {
    res.redirect('/api/info')
})

app.get('/api/status' , (req,res)=> {
    res.status(200).json({"status" : 200})
})

app.get('/api/greet/:name' , (req,res)=> {
    res.json(`hello ${req.params.name}`)
})

app.route('/api/data') 
    .get((req,res)=> {
        res.json({"message" : "hello from chainable route"})
    })
    .post((req,res)=> {
        res.status(201).json({"message" : "post method chainable route"})
    });

app.use('/api/weather' , weatherRouter)




app.listen(PORT , ()=>{
    console.log("server is listening");
    
})