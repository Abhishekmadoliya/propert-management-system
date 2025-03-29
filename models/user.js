const mongoose = require("mongoose");

const schema = mongoose.Schema;

const passportLocalMonggose = require("passport-local-mongoose");


const userSchema = new schema({
    email:{
        type:String,
        required:true,
    }
})

userSchema.plugin(passportLocalMonggose)

module.exports = mongoose.model("User", userSchema);