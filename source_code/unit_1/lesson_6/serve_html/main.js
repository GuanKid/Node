const port = 3000,
http = require("http"),
httpStatus = require("http-status-codes"),
fs = require("fs");

const routeMap = {
    "/": "views/index.html"
};

http.createServer((req,res) => {
    res.writeHead(httpStatus.OK, {
        "Content-Type": ""
    })
}

)