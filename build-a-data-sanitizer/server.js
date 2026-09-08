import express from 'express'
import { Router } from 'express'
import { inputCleaner,inputValidator } from './middleware.js'

const app = express()
const router = Router()

app.use(express.urlencoded({extended : true}))
app.use(express.json())


app.get('/' , (req,res)=> {
    res.redirect(302 ,'/form')
})

app.get('/form' , (req,res)=> {
    res.status(200).sendFile('index.html', { root: '/workspaces/back-end-development-and-apis/build-a-data-sanitizer/public' })
})


router.post("/",inputCleaner , inputValidator , (req,res)=> {
    res.json({
        username: req.body.username,
        comment: req.body.comment
    })
})


app.use("/submit" , router)
app.use(express.static('/workspaces/back-end-development-and-apis/build-a-data-sanitizer/public'))


app.listen(3000 , ()=> {
    console.log('server listening')
})