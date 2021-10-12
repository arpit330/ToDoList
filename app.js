// jshint version:6
require('dotenv').config()

const express = require("express");
const app = express();

app.use(express.static('views/images'));

var hbs = require('express-handlebars');

const mongoose = require('mongoose');
const connection_url = process.env.conne_link;
mongoose.connect(connection_url);


app.engine('hbs', hbs({ extname: 'hbs' }));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const default_items = ["cook food", "play football"];

const To_Do_Schema = mongoose.Schema({
    name: String,
    passwd: String,
    data: [String]
});

const To_Do = mongoose.model('todo_data', To_Do_Schema);







// user data
var user_name = "";
var user_passwd = "";





app.post("/sup",function(req,res){
    res.render("signup",{layout:false});
})

app.post("/add_user",function(req,res){

    user_name = req.body.userr_name;
    user_passwd = req.body.pass; 
    // var sorl = req.body.val;
    // console.log(user_name);
    // console.log(req.body.pass);
    // console.log(req.body.val);

    To_Do.findOne({ name: user_name }, function (err, fetched_data) {
        var user_message = "";


        if (fetched_data == null) {
            // console.log("user not found");
            user_message = "user created , now login";


            const new_task = new To_Do({
                name: user_name,
                passwd: user_passwd,
                data: ["default1", "default2"]
            })
            To_Do.insertMany(new_task, function () {
            });
            // new_task.save();

            res.render("login",{layout:false,userr_message: user_message});
        } else {
            user_message = "user exist , give different username";
            res.render("login",{layout:false,userr_message: user_message});
        }


        // console.log("user data  :   " + fetched_data);
    })
    

})


app.post("/login",function(req,res){
    
    res.render("login",{layout:false});
    
})

app.post("/login_user",function(req,res){
    user_name = req.body.userr_name;
    user_passwd = req.body.pass; 
    

    To_Do.findOne({ name: user_name ,passwd : user_passwd}, function (err, fetched_data) {
        var user_message = "aaaaaa";
        if (fetched_data == null) {
            console.log("user not found");
            user_message = "user not found";
            res.render("login",{layout:false,userr_message: user_message});
        } else {
            res.redirect("/");
        }
        // console.log("user data  :   " + fetched_data);
    });
})





var tasks = ["snkd"];

app.get("/", function (req, res) {
    console.log(user_name);

    





    To_Do.find({ name:user_name }, function (err, fetched_data) {
        
        // console.log(fetched_data);
        console.log(user_name);
        var tasks_to_print = fetched_data[0].data;

        res.render("home", {
            new: tasks_to_print,
            chomu:user_name
        });
    });
    




});


app.post("/addtask", function (req, res) {
    var task = req.body.newtask;
    tasks.push(task);
    console.log(task);

    

    To_Do.updateOne({ name: user_name }, { $push: { data: task } }, function () {
        // data.push(task)
    });

    res.redirect("/");

});


app.post("/delete", function (req, res) {
    console.log(req.body.task_to_delete);
    var ttd = req.body.task_to_delete;
    if (ttd == '') {

        // console.log(req.body.task_to_delete);
        To_Do.updateOne({ name: user_name }, { $pull: { data: null } }, function () {
        });
    }

    To_Do.updateOne({ name: user_name }, { $pull: { data: ttd } }, function () {
    });

    res.redirect("/");

});


app.post("/move", function (req, res) {

    var to_move = req.body.To_move;


    // console.log(to_move);
    var indx_str = to_move.slice(1, to_move.length);
    var indx = parseInt(indx_str);
    // console.log(indx);

    var tasks_to_print = [];

    if (to_move[0] == 'u') {

        To_Do.findOne({ name: user_name }, function (err, fetched_data) {
            // console.log(fetched_data.data);
            tasks_to_print = fetched_data.data;
            // console.log(tasks_to_print);

            if (indx > 0) {
                var tmp = tasks_to_print[indx];
                tasks_to_print[indx] = tasks_to_print[indx - 1];
                tasks_to_print[indx - 1] = tmp;
            }
            console.log(tasks_to_print);

            To_Do.updateOne({ name: user_name }, { data: tasks_to_print }, function () {
                // data.push(task)
                // console.log("success");
            });

            res.redirect("/");

        });

    } else {

        To_Do.findOne({ name: user_name }, function (err, fetched_data) {
            // console.log(fetched_data.data);
            tasks_to_print = fetched_data.data;
            // console.log(tasks_to_print);

            var max_len = tasks_to_print.length;

            if (indx < max_len - 2) {
                var tmp = tasks_to_print[indx];
                tasks_to_print[indx] = tasks_to_print[indx + 1];
                tasks_to_print[indx + 1] = tmp;
            }
            // console.log(tasks_to_print);

            To_Do.updateOne({ name: user_name }, { data: tasks_to_print }, function () {
                // data.push(task)
                // console.log("success");
            });

            res.redirect("/");

        });


    }



});


app.listen(process.env.PORT || 3000, function () {
    console.log("server is running");
});










