var request = require("request"),
    http = require("http");

var port = process.env.PORT || 8080;

var server = http.createServer(function (req, resp) {
    var url = req.url.substr(1);

    if (url) {
        req.pipe(request(url)).pipe(resp)
    }
});

server.listen(port);