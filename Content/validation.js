let cap = /[A-Z]/;
let sml = /[a-z]/;
let num = /[0-9]/;
let special = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?+]/;


function Validate(){
    let parameter = 3;
    let email = document.getElementById('email').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if(num.test(username) || special.test(username)){
        parameter--;
        document.getElementById('name-error').innerHTML = "*Use only Alphabets"
    }

    if(!email.includes('@') || !email.endsWith('.com' || !email.endsWith('.in'))){
        parameter--;
        document.getElementById('mail-error').innerHTML = "*Must be in correct format"
    }

    if(!(cap.test(password) && sml.test(password) && special.test(password) && num.test(password) && password.length > 8)){
        parameter--;
        document.getElementById('password-error').innerHTML = "*Use Uppercase,lowercase,symbol and numbers. Must be greater than 8 characters"
    }

    if(parameter!==3){
        return false;
    }
    else{
        alert('Registration Successful');
        return true;
    }

}



function Zerolength(){
    let data =  document.getElementById('addtxt').value;
    if(data.length === 0){
        alert(`The Note is Empty!!Can't add`)
        return false;
    }
    else{
        return true;
    }
}