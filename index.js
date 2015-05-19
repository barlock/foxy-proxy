var cheerio = require("cheerio"),
    express = require("express"),
    request = require("request"),
    _ = require("underscore");

var port = process.env.PORT || 8080,
    app = express();

app.use(function (req, res) {
    var url = req.query.url;
    req.url = "";

    if (url) {
        if(url.match(/\.(css|js|png|gif|jpeg|jpg)$/)) {
            request(decodeURIComponent(url)).pipe(res);
        } else {
            request(decodeURI(url), function(err, response, body) {
                var $ = cheerio.load(body),
                    host = req.protocol + '://' + req.get('Host') + req.url;

                $("[href]").each(function () {
                    var elem = $(this);
                    elem.attr("href", host + "/?url=" + encodeURIComponent(elem.attr("href")))
                });

                $("[src]").each(function () {
                    var elem = $(this);
                    elem.attr("src", host + "/?url=" + encodeURIComponent(elem.attr("src")))
                });

                _.each(response.headers, function(value, key) {
                    if(typeof value === "string" && key !== "content-security-policy") {
                        res.setHeader(key, value);
                    }
                });
                res.send($.html()).end();
            });
        }
    } else {
        req.send("NO! add a url query! like ?url=https://github.com");
    }
});

app.listen(port);