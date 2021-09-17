'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const util = require('util');
const { v4: uuidv4 } = require('uuid');
const { json } = require('express');
const { send } = require('process');
uuidv4();

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw());
//initialize file that we create/write into
const jsonFile = path.resolve(__dirname,'./data/database.json');
//initialize array
let carDatabase = [];
//if json file already exists it gets the data from it and stores it in the array
if(fs.existsSync(jsonFile)){
    carDatabase = JSON.parse(fs.readFileSync(jsonFile));
}

//upon get request
app.get('/', async (req, res) => {
  //header type is set to json
    res.setHeader('Content-Type', 'application/json');
    //if the array is empty print message
    if(carDatabase.length == 0){
        res.send('Nothing to see here');
    }else{
      //otherwise print out the stringified version of the array
    res.send(JSON.stringify(carDatabase));
    }
});

//on get ID request
app.get('/:id', async (req, res) => {
  //header type set to json
    res.setHeader('Content-Type', 'application/json');
    //saving the ID from url to variable
    const id = req.params.id;
    //printing the item from the array that has a matching ID to the one in the url
    res.send(JSON.stringify(carDatabase.filter(car => id == car.id)));


});

//upon post request
app.post('/', async (req, res) => {
    // send the name and year from url to array and generate ID with uuidv4()
    carDatabase.push({
        id: uuidv4(),
        name: req.body.name || null,
        year: req.body.year || null
      });
      //create/overwithe file with the items in array 
      fs.writeFile(jsonFile, JSON.stringify(carDatabase), (err) => {
        if (err)
          console.log(err);
        else {
          res.send("Changes saved successfully\n");
        }
        });
        //output stringified version to console
    console.log(JSON.stringify(carDatabase));
});


//on delete request
app.delete('/:id', async (req, res) => {
    //save ID from url to variable
    const id = req.params.id;
    //find item in array based on ID and save its index to variable
    const toDelete = carDatabase.findIndex(car => id == car.id);
    //if the index is bigger or equals to 0, therefore it exists
    if(toDelete >= 0){
        //delete the item based on its index
        carDatabase.splice(toDelete, 1);   
        res.send(id + ' deleted');
    }
    //overwrite file with the new array
    fs.writeFile(jsonFile, JSON.stringify(carDatabase), (err) => {
        if (err)
          console.log(err);
        else {
          res.send("Changes saved successfully\n");
        }
        });
});
//listening on port 3000
app.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000');
  });

