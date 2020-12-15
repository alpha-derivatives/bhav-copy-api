const express = require('express');
const BhavCopy = require("./bhav-copy");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
// app.use(bodyParser.json({limit: '50mb'}));

app.get('/', (req, res) => {
  res.send('working');
});

app.get('/livecheck', (req, res) => {
  res.send({success: true});
});

app.get('/get-bhav-copy', (req, res) => {
  const { company, day, month, year } = req.query;
  const options = {
    type: 'json'  // optional. if not specified, zip file will be downloaded valid TYPES: ['json', 'csv', 'zip']
   // dir: "xxxx" // optional. if not specified, files will be downloaded under NSE folder
  };
  const request = new BhavCopy(options);
  
  request.download({
    month: month, // required (values acn be anything given below under Month CODES)
    year: year, // required (values acn be anything given below under YEAR CODES)
    day: day // optional (values can be anything in range: 1 - 31)
  })
  .then(data => {
    const filterData = data[0].filter((v1) => v1.SYMBOL === company);
    // console.log(filterData); // Wait! Files are downloading...
    res.send(filterData);
  })
  .catch(err => {
    console.log(err);
    res.send(err);
  });
});



var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});