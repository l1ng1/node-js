let tbl = document.querySelector('.norm')
let btn = document.querySelector('.btn');

btn.onclick =()=>{
    let num = Number(tbl.textContent);
    num++;
    tbl.textContent = num;
}


