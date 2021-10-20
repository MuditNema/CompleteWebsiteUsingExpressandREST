const express = require('express');
const hbs = require('hbs');
const methodOverride = require('method-override');
const url = require('url');
const { CheckUser } = require('./database/repo');
const app = express();
let repo = require('./database/repo');
const port = process.env.PORT || 3000;
let obj={};



// // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
app.use(methodOverride('_method'));
// // Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(express.static(__dirname + '/Content'));

app.set('view engine' , 'hbs');

app.get('/',(req,res)=>{
    res.render('index');
    // res.render('profile');
})

//Making our profile page after one login

app.get('/:name',async (req,res)=>{
    // res.render(__dirname + '/Content/profile');
    // res.send(req.params);

    const user = await repo.GetUser(req.params.name);
    res.render('profile',user[0]);
    // res.send(req.params.name)
    // res.send(url.parse(str,true))
    // res.render('profile');
})

// router.get('/:name/del',(req,res)=>{
//     res.send(req.params.name);
// })

app.post('/signup',async (req,res)=>{
    try {
        let check =  await repo.CheckUser(req.body);
        if(check.length===1){
            res.send('User already exists');
        }
        else{
            let user = await repo.RegisterUser(req.body);
            res.redirect('/');
            // res.send(user);
        }
    } catch (error) {
        res.send(error)
    }
    // res.send(req.body);
})

app.post('/login',async (req,res)=>{
    try {
        let check =  await repo.CheckUser(req.body);
        if(check.length === 0){
            res.send(`No users with username : ${req.body.username}`);
        }
        else{
            if(check[0].name === req.body.username && check[0].password ===  req.body.pass){
                // res.redirect('/');
                obj = check[0];
                res.redirect('/' + req.body.username);
                // res.redirect('www.google.com');
            }
            else{
                res.send('Wrong Inputs');
            }
        }
    } catch (error) {
        res.send(error);
    }
})

//Writing the function to add a note in our website in an array
app.post('/add',async (req,res)=>{
    try {
        let data = req.body.addtext;
        // res.send(data);
        //here data is nothing but a string (note entered by the user)

        let user = await repo.GetUser(obj.name);
        // res.send(user[0]);
        await repo.AddtoNote(data,user[0]);
        res.redirect('/' + user[0].name);

        // console.log(added);
    } catch (error) {
        res.send(error);
    }

    // res.redirect('/');
    
})

app.delete('/:name/:val',async (req,res)=>{
    try {
        let name = req.params.name;
        let index = req.params.val;
        //here data is nothing but a string (note entered by the user)
        let result = await repo.DeleteNote(name,index);
        res.redirect('/' + name);
        // res.send('Delete successful');
        // console.log(added);

    } catch (error) {
        res.send(error);
        console.log(error);
    }

    // res.redirect('/');
    // res.redirect('/muditnema');
})

app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
})