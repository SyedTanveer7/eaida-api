const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const userRoutesV1 = require("./routes/v1/user");
const addressRoutesV1 = require("./routes/v1/address");
const bookingRoutesV1 = require("./routes/v1/booking");
const specialistRoutesV1 = require("./routes/v1/specialist");
const reviewsRoutesV1 = require("./routes/v1/reviews");
const reviewsBlackListedJWTV1 = require("./routes/v1/blacklistedJWT");
const braintreeV1 = require("./routes/v1/braintree");

const port = process.env.PORT || 3000;

mongoose.connect("mongodb://eidadev:patrick22@ds157516.mlab.com:57516/eida-dev", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(methodOverride("_method"));

app.use("/api/v1/user", userRoutesV1);
app.use("/api/v1/address", addressRoutesV1);
app.use("/api/v1/booking", bookingRoutesV1);
app.use("/api/v1/specialist", specialistRoutesV1);
app.use("/api/v1/reviews", reviewsRoutesV1);
app.use("/api/v1/blacklistedjwt", reviewsBlackListedJWTV1);
app.use("/api/v1/braintree", braintreeV1);

app.get('*', (req, res) => {
    res.status(404).send("You don't have any permission to access this.");
});

app.listen(port, () => {
    console.log("EIADA has Started in PORT 3000 http://localhost:3000/");
});