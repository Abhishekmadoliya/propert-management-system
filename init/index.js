const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');


main().then(()=>{
    console.log("connected to db");
    
}).catch((err)=>{
    console.log(err);
    
})

async function main() {
    mongoose.connect('mongodb://localhost:27017/hostals');
}

const initdb = async () => {
    await Listing.deleteMany({});
    initdata.data=  initdata.data.map((obj)=>({...obj,owner:"679a36155e6954b189814373"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
    
};

initdb();