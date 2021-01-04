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

app.get('/get-bhav-copy', async (req, res) => {
  const { company, day, month, year, expiryDate, instrument, strike_price, call_put } = req.query;
  const options = {
    type: 'json'  // optional. if not specified, zip file will be downloaded valid TYPES: ['json', 'csv', 'zip']
   // dir: "xxxx" // optional. if not specified, files will be downloaded under NSE folder
  };
  const request = new BhavCopy(options);

  try{
    const data = await request.download({month, year, day});
    console.log(data);
    if(data && data[0]) {
      const filterData = data[0].filter((v1) => v1.SYMBOL === company && v1.EXPIRY_DT === expiryDate && v1.INSTRUMENT.includes(instrument));
      if(instrument === 'OPT'){
        const optionsData = filterData.filter((v2) => v2.STRIKE_PR === strike_price && v2.OPTION_TYP === call_put);
        console.log(optionsData);
        res.status(200).send(optionsData);
      }else{
        console.log(filterData); // Wait! Files are downloading...
        res.status(200).send(filterData);
      }
    }
  }catch(err){
    console.log(err);
    res.send(err);
  }
  
  
  // request.download({
  //   month: month, // required (values acn be anything given below under Month CODES)
  //   year: year, // required (values acn be anything given below under YEAR CODES)
  //   day: day // optional (values can be anything in range: 1 - 31)
  // })
  // .then(data => {
  //   // console.log(data);
  //   if(data && data[0] && data[0].length > 0) {
  //     const filterData = data[0].filter((v1) => v1.SYMBOL === company);
  //     // console.log(filterData); // Wait! Files are downloading...
  //     res.send(filterData);
  //   }
  // })
  // .catch(err => {
  //   console.log(err);
  //   res.send(err);
  // });
});



var server = app.listen(process.env.PORT || 5000, function () {
  var port = server.address().port;
  console.log("Express is working on port " + port);
});