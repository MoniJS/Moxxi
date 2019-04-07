let path = require("path");
let express = require("express");
let app = express();

app.use(express.static("src"));

let port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on ${port}`));