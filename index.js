import express from "express"
import cors from "cors"
import userRouter from "./router/user.js"
import dbToConnect from "./database/mongoose_connection.js"
const app = express()
app.use(express.json())
app.use(cors())
await dbToConnect()

app.use("/api/users", userRouter)
const PORT = 3000


app.get("/", (req, res) =>{
    res.status(200).json({message:"murugaa"})
})

app.listen(PORT, () =>{
    console.log("server listening on port", PORT);
})