function loginHandler(){

    document.getElementById("login").addEventListener("submit", async (e)=>{

        e.preventDefault();
        const userType = document.getElementById("user-type").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const response = await post({userType,username,password},`https://localhost:3000`);
        if(response.status===404)
            window.alert("Wrong credentials");
        else if(response.status===500){
            console.error(response.text());
        }
    })
}

function signupHandler(){
    document.getElementById("signup").addEventListener("submit", async (e)=>{

        e.preventDefault();
        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("pasword").value;
        const cpassword = document.getElementById("cpassword").value;

        if(await checkStrength(password)) {
            if(cpassword===password){
                const response = await post({name,username,password},`https://localhost:3000`);
                if(response.status===404)
                    window.alert("User already exists");
                else if(response.status===500) {
                    console.error(response.text());
                }
            }
            else{
                window.alert("Password entered is different");
            }
        }
        else{
            window.alert("Weak password. Must have length more than 7 and contain atleast 1 number and 1 special character");
        }
    })
}

function clientHandler(){
    document.getElementById("view").addEventListener("click", async ()=> {
        await get(`https://localhost:3000/client/home`);
    })
    
    document.getElementById("return").addEventListener("click", async ()=> {
        await get(`https://localhost:3000/client/return`);
    })

    document.getElementById("borrow").addEventListener("click", async ()=> {
        await get(`https://localhost:3000/client/history`);
    })

    document.getElementById("borrow-form").addEventListener("submit", async (e)=>{

        e.preventDefault();
        const userType = document.getElementById("user-type").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("pasword").value;

        await post(`https://localhost:3000/client/home`, {books: books, booksid: booksid});
    })

    document.getElementById("return-form").addEventListener("submit", async (e)=>{

        e.preventDefault();
        const returnBooks = document.getElementsByClassName("return");
        let booksToReturn = [];
        for(let i=0; i<returnBooks; i++) {
             booksToReturn.add(returnBooks.value);
        }

        await post(`https://localhost:3000/client/return`, {booksToReturn: booksToReturn});
    })
}

function adminHandler(){

    document.getElementById("catalog").addEventListener("click", async ()=> {
        await get(`https://localhost:3000/admin/home`);
    })

    document.getElementById("requests").addEventListener("click", async ()=> {
        await get(`https://localhost:3000/admin/requests`);
    })

    document.getElementById("prompt").addEventListener("click", async ()=> {
        await get(`https://localhost:3000/admin/add`);
    })

    document.getElementById("prompt-form").addEventListener("submit", async (e)=> {
            
        e.preventDefault();
        const bookName = document.getElementById("new-book").value;
        await post({book: bookName}, `https://localhost:3000/admin/add`); 
    })

    let isAddClicked = [];
    for(let i=0; i<document.getElementsByClassName("add").length; i++) {
        isAddClicked.add(false);
    }

    let booksToAdd = [];
    const addButton = document.getElementsByClassName("add");
    for(let i=0; i<addButton.length; i++) {
        addButton[i].addEventListener("click", ()=> {
            if(!isAddClicked) {
                isAddClicked[i]=true;
                addButton[i].style.backgroundColor = "green";
                addButton[i].style.color = "white";
                booksToAdd.add(document.getElementsByClassName("cbook"[i].text));
            }
            else{
                isAddClicked[i]=false;
                addButton[i].style.backgroundColor = "white";
                addButton[i].style.color = "black";
                delete booksToAdd[booksToAdd.indexOf(document.getElementsByClassName("cbook"[i].text))];
            }
        })
    }

    let isRemoveClicked = [];
    for(let i=0; i<document.getElementsByClassName("add").length; i++) {
        isRemoveClicked.add(false);
    }

    let booksToRemove = [];
    const removeButton = document.getElementsByClassName("remove");
    for(let i=0; i<removeButton.length; i++) {
        removeButton[i].addEventListener("click", ()=> {
            if(!isRemoveClicked) {
                isRemoveClicked=true;
                removeButton[i].style.backgroundColor = "red";
                removeButton[i].style.color = "white";
                booksToRemove.add(document.getElementsByClassName("cbook"[i].text));
            }
            else {
                isRemoveClicked=false;
                removeButton[i].style.backgroundColor = "white";
                removeButton[i].style.color = "black";
                delete booksToRemove[booksToRemove.indexOf(document.getElementsByClassName("cbook"[i].text))];
            }
        })
    }

    document.getElementById("catalog-form").addEventListener("submit", async (e)=>{
        e.preventDefault();

        await post({booksToAdd: booksToAdd, booksToRemove: booksToRemove}, `https://localhost:3000/admin/home`);
    })

    let usersAccept = [];
    let bookAccept = [];
    let usersDeny = [];
    let bookDeny = [];
    const acceptButton = document.getElementsByClassName("accept");
    const denyButton = document.getElementsByClassName("deny");
    for(let i=0; i<denyButton.length; i++) {
        acceptButton[i].addEventListener("click", ()=> {
            acceptButton[i].style.backgroundColor = "green";
            acceptButton[i].style.color = "white";

            usersAccept.add(document.getElementsByClassName("user")[i].text);
            bookAccept.add(document.getElementsByClassName("book")[i].text);
        })
        
        denyButton[i].addEventListener("click", ()=> {
            denyButton[i].style.backgroundColor = "red";
            denyButton[i].style.color = "white";

            usersDeny.add(document.getElementsByClassName("user")[i].text);
            bookDeny.add(document.getElementsByClassName("book")[i].text);
        })
    }

    document.getElementById("user-requests-form").addEventListener("submit", async (e)=>{
        e.preventDefault();

        await post({usersAccept: usersAccept, bookAccept: bookAccept, usersDeny: usersDeny, bookDeny:bookDeny}, `https://localhost:3000/admin/requests`);
    })
}

async function post(data, url) {
    return new Promise(() => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            return response;
        })
        .catch(error => {
            console.error(error);
        });
    });
}

async function get(url) {
    return new Promise(() => {
        fetch(url)
        .then(response => response.json())
        .catch(error => console.error(error));
    });
}

async function checkStrength(password) {
    let isStrong = false;
    return new Promise((resolve) => {
        if(password.length>=8) {
            let specialCount=0;
            let numberCount=0;
            for(let i=0; i<password.length; i++) {
                let ord = password.charCodeAt(i);
                if(ord>=48 && ord<=57)
                    numberCount++;
                else if(!(ord>=65 && ord<=90) && !(ord>=97 && ord<=122))
                    specialCount++;
                if(numberCount>=1 && specialCount>=1){
                    isStrong = true;
                    break;
                }
            }
        }
        resolve(isStrong);
    });
}

let title = document.title;

if(title==="Login Page") loginHandler();
else if(title==="Signup Page") signupHandler();
else if(title==="Client Page") clientHandler();
else if(title==="Admin Page") adminHandler();