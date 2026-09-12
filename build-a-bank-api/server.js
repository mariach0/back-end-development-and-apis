import express from 'express'
import { getAccounts,saveAccounts } from './db.js'

const app = express()
const PORT = 9000

app.use(express.json())
app.set("json spaces" , 2)

app.get("/" , (req,res)=> {
    res.status(200).send("Tiny Bank API (Express 5) running...")
})

app.get("/health" , (req,res)=> {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memoryUsage: process.memoryUsage()
    })
})

app.get("/accounts" , async (req,res)=> {
    const accounts = await getAccounts()
    res.json(accounts) 
})

app.get("/accounts/:id" , async (req,res)=> {
    const accounts = await getAccounts()
    const account = accounts.find((a) => a.id === parseInt(req.params.id))

    if (!account) {
        const err = new Error("Account not found")
        err.status = 404;
        throw err
    }

    res.status(200).json(account)
})

app.post("/transfer" ,async (req,res)=> {
    const { fromId, toId, amount } = req.body
    if (!fromId || !toId || !amount) {
        const err = new Error("Missing required fields : fromId , toId , amount")
        err.status = 400
        throw err
    }
    if (amount <= 0) {
        const err = new Error("Amount should be greater than 0")
        err.status = 400
        throw err
    }

    const accounts = await getAccounts()
    const sender = accounts.find((acc) => acc.id === fromId)
    if (!sender) {
        const err = new Error("Sender not found")
        err.status = 404
        throw err
    }

    const reciever = accounts.find((acc) => acc.id === toId)
    if (!reciever) {
        const err = new Error("Receiver not found")
        err.status = 404
        throw err
    }

    if (sender.balance < amount) {
        const err = new Error("Can not transfer money")
        err.status = 409
        throw err
    }

    sender.balance = sender.balance - amount
    reciever.balance = reciever.balance + amount

    await saveAccounts(accounts)

    res.json({
        message: "Transfer successful",
        senderName: sender.owner,
        recipientName: reciever.owner,
        amountTransferred: amount,
        senderNewBalance: sender.balance,
        recipientNewBalance: reciever.balance,
    })
})

// app.get("/broken" , (req,res,next)=> {
//     const err = new Error("error in broken")
//     next(err)
// })


app.use((err,req,res,next)=> {
    console.error(err.message);
    
    res.status(err.status || 500).json({
        error: {
            message: err.message || "Internal Server Error",
            status: err.status || 500,
        },
    })
})

const server = app.listen(PORT , ()=> {
    console.log(`Tiny Bank API running on http://localhost:${PORT}...`);
    
})

process.on("SIGTERM" , ()=> {
    console.log("SIGTERM received , closing the server");
    server.close(()=> {
        console.log("server closed on sigterm");
        process.exit(0)
        
    })
    
})

process.on("SIGINT" , ()=> {
    console.log("SIGINT recieved , closing the server");
    server.close(()=> {
        console.log("server closed on sigint");
        process.exit(0)
    })
    
})