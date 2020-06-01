var express = require('express');
var path = require('path');
var ngApp = express();


ngApp.use(express.static('./dist/lightcutoff'));
ngApp.get('/*', function(request, response) {
    response.sendFile(path.join(__dirname, '/dist/lightcutoff/index.html'));
});
ngApp.listen(process.env.PORT || 8080);
