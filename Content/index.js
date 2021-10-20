let x = document.getElementById('log');
let y = document.getElementById('reg');

x.addEventListener('click' , () =>{
    let reg = document.getElementById('form-registration');
    let log = document.getElementById('form-login');
    reg.classList.add('d-none');
    log.classList.remove('d-none');
})

y.addEventListener('click' , () =>{
    let reg = document.getElementById('form-registration');
    let log = document.getElementById('form-login');
    reg.classList.remove('d-none');
    log.classList.add('d-none');
})


