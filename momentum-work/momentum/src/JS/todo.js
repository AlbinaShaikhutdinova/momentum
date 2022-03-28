const icon = document.querySelector('.todo-icon');
const content = document.querySelector('.todo-content');
const input = document.querySelector('.input-text.todo');
const todos = document.querySelector('.todos-list');
const ar = [];
icon.addEventListener('click',showTodo);
input.addEventListener('change',addTodo);
window.addEventListener('load', getLocalStorage);
window.addEventListener('beforeunload', setLocalStorage);
function showTodo(){
    content.classList.toggle('hidden');
}

function addTodo(e){
    let val="";
    console.log(e);
   
        if(typeof e ==='string')
            val=e;
        else val=input.value; 
    if(val) {  
        const li = document.createElement('li');
        li.classList.add('todo-item');
        const check = document.createElement('input');
        check.type='checkbox';
        const span = document.createElement('span');
        const div = document.createElement('div');
        div.classList.add('check-span');
        span.textContent=val;
        div.append(check);
        div.append(span);
        const bin = document.createElement('div');
        bin.classList.add('todo-bin'); 
        bin.addEventListener('click', deleteTodo)     
        li.append(div);
        li.append(bin);
        todos.append(li);
        ar.push(val);
    }
    input.value="";
}
function deleteTodo(e){
    const item = e.target.closest('.todo-item');
    item.style.display = 'none';
    var index = ar.indexOf(item.querySelector('span').textContent);
    if (index !== -1) {
        ar.splice(index, 1);
    }
}

function setLocalStorage() {
    localStorage.setItem('todo',JSON.stringify(ar));
}

function getLocalStorage() {
    if(localStorage.getItem('todo'))
    {
        const ar = JSON.parse(localStorage.getItem('todo'));
        for(let el of ar)
        {
            addTodo(el);
        }
    }
     
}