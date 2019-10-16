let express = require('express');
let app = express();
app.use(express.static(__dirname));
app.get('/time', function(req, res) {
    res.end(new Date().toLocaleString());
});
app.listen(8000);