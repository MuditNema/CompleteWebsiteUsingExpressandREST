const { count } = require('console');
const { builtinModules } = require('module');
const { MongoClient } = require('mongodb');
const dbName = 'Mudits_db';
const url = 'mongodb://localhost:27017';


function Main() {
    async function RegisterUser(obj) {
        let data = {
            email : obj.email,
            name: obj.username,
            password: obj.pass,
            count : 0,
            notesData : '',
            notes : []
        }
        const client = new MongoClient(url);
        await client.connect();
        let added = await UserAddition(data);
        let admin = client.db(dbName).admin();
        // await client.db(dbName).dropDatabase();
        console.log(await admin.listDatabases());
        client.close();
        return added;
    }

    function UserAddition(data) {
        return new Promise(async (res, rej) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const result = await db.collection('UsersWebsite').insertOne(data);
                res(result);
                client.close();
            }
            catch (err) {
                rej(err);
            }
        })
    }

    function CheckUser(obj){
        return new Promise(async (res,rej) =>{
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const result = await db.collection('UsersWebsite').find({name : obj.username});
                res(await result.toArray());
                client.close();
            }
            catch (err) {
                rej(err);
            }
        })
        
    }

    function GetUser(_name){
        return new Promise(async (res,rej) =>{
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const result = db.collection('UsersWebsite').find({name : _name});
                res(await result.toArray());
                client.close();
            }
            catch (err) {
                rej(err);
            }
        })
    }

    function AddtoNote(note,obj){
        return new Promise(async (res,rej) =>{
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                const result = await db.collection('UsersWebsite').updateOne({name : obj.name},{$inc : {count : 1},$push : {notes : note}});

                let x = await GetUser(obj.name);
                let user = x[0];
                let notes = user.notes;
                let str="";
                notes.forEach((element,index) => {
                    str += `<div class="show-elem"><p>${element}</p>
                <form method="POST" action="/${obj.name}/${index}?_method=DELETE">
                <button type="hidden" name="_method" value="DELETE">Delete</button></form></div>
                `
                });
                const result1 = await db.collection('UsersWebsite').updateOne({name : obj.name},{$set : {notesData : str}});
                res(result1);
            }
            catch (err) {
                rej(err);
            }
        })
    }

    function DeleteNote(_name,index){
        return new Promise(async (res,rej)=>{
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);
                let x = await GetUser(_name);
                let user = x[0];
                let notes = user.notes;
                let elem = notes[index];
                //notes here is the array in static format
                const del = await db.collection('UsersWebsite').findOneAndUpdate({name : _name},{$pull:{notes:{$in:[elem]}},$inc:{count : -1}});

                let str="";

                let x1 = await GetUser(_name);
                let user1 = x1[0];
                let notes1 = user1.notes;

                notes1.forEach((element,index) => {
                    str += `<div class="show-elem"><p>${element}</p>
                <form method="POST" action="/${_name}/${index}?_method=DELETE">
                <button  type="hidden" name="_method" value="DELETE">Delete</button></form></div>
                `
                });
                const result1 = await db.collection('UsersWebsite').updateOne({name : _name},{$set : {notesData : str}});

                res(result1);
            } catch (error) {
                rej(error);
            }
        })
    }

    return {RegisterUser , UserAddition , CheckUser , AddtoNote , GetUser , DeleteNote}
}


module.exports = Main();