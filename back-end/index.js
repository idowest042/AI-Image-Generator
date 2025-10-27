import express from "express"
import cors from "cors"
import {connectdb} from "./config/db.js"
import authRoutes from "./Router/authRoutes.js"
import AIRoute from "./Router/AIRoute.js"
const port= process.env.PORT || 3000
const app = express()
connectdb()
app.use(cors({
    origin: "http://localhost:5173", // Your React app URL
  credentials: true,
}))
app.use(express.json())
app.use("/api/ai", AIRoute)
app.use("/api/auth", authRoutes)
app.use(express.urlencoded({ extended: true }))
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})