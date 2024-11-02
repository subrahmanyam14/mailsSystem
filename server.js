const cors = require("cors")
const mailBoxRoute = require("./src/routes/mailBoxRoute.js");
const authRoute = require("./src/routes/authRoute.js");
const connection = require("./connection.js");
const {app, server} = require("./socketio.js");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
// app.use(express.json());

app.get("/", (req, res) => {
    return res.status(200).send(`Server running on the port ${port}`)
});

app.use("/mail", mailBoxRoute);

app.use("/auth", authRoute);

server.listen(port, async() => {
    console.log(`Server running on the port - ${port}`);
    await connection();
} )