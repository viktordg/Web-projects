import express from "express"
const app = express();
const port = 3000;

app.get("/", (req, res) =>{
    res.send("Hello, World!");
})
app.post("/register", (req, res) =>{
    res.sendStatus(201);
})
app.put("/user/VG", (req, res) =>{
    res.sendStatus(200);
})
app.patch("/user/VG", (req, res) =>{
    res.sendStatus(200);
})
app.delete("/user/VG", (req, res) =>{
    res.sendStatus(200);
})

app.listen(port, () =>{
    console.log(`Server listening on port ${port}.`);
})
