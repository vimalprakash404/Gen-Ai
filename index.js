const  express  = require('express'); 
const  app = express();
require("dotenv").config();

const path = require("path");
const gModel = require("./service/gModel")


const PORT =  process.env.PORT || 3001;

app.get("/api/:input" , async (req , res) =>{
    const {input} =  req.params ; 
    console.log(input);
    const output =await gModel.run(input);
    return  res.send(output);
})


app.use('/', express.static(path.join(__dirname, "frontend/dist")));
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
});

app.listen(PORT , ()=>{
    console.log(`server is running on ${PORT}`);
})