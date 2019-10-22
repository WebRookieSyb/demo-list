const express = require("express");
const app = express();
app.listen(3000);

app.post('/api/save-subscription/', function(req, res) {
    if(!isValidSaveRequest(req, res)) {
        return;
    }

    return saveSubscriptionToDataBase(req.body)
    .then(function(subscriptionId) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data: {success: true}}));        
    })
    .catch(function(err) {
        res.status(500);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(
            error: {
                id: 'unable-to-save-subscription',
                message:'the subscription was received but we were unable to save it to our dataBase'
            }
        ));
    });
});
