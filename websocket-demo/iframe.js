let express = require("express");
let app = express();
app.use(express.static(__dirname));
app.get("/time", function(req, res) {
  setInterval(function() {
    let data = new Date().toLocaleString();
    res.write(`
        <script type='text/javascript'>
        parent.document.getElementById('time').innerHTML = "${data}";
        </script>
    `);
  },1000);
});
app.listen(8000);
