const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(9000);

console.log(
  "You can now view the running app in the browser at the following link: \n"
);
console.log("http://localhost:9000");
