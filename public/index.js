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
    document.getElementById("view").addEventListener("click", ()=> {
        
        document.getElementById("view-books").style.display = block;
        document.getElementById("return-books").style.display = none;
        document.getElementById("borrow-history").style.display = none;

        //loading-animation
        //get request for books
    })
    
    document.getElementById("return").addEventListener("click", ()=> {
        
        document.getElementById("view-books").style.display = none;
        document.getElementById("return-books").style.display = block;
        document.getElementById("borrow-history").style.display = none;

        //loading-animation
        //get request for books to be returned
    })

    document.getElementById("borrow").addEventListener("click", ()=> {
        
        document.getElementById("view-books").style.display = none;
        document.getElementById("return-books").style.display = none;
        document.getElementById("borrow-history").style.display = block;

        //loading-animation
        //get request for history
    })

    document.getElementById("borrow-form").addEventListener("submit", (e)=>{

        e.preventDefault();
        const userType = document.getElementById("user-type").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("pasword").value;

        //post request to server

    })


    document.getElementById("return-form").addEventListener("submit", (e)=>{

        e.preventDefault();
        const userType = document.getElementById("user-type").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("pasword").value;

        //post request to server

    })
}

function adminHandler(){

    document.getElementById("catalog").addEventListener("click", ()=> {
        
        document.getElementById("manage-catalog").style.display = block;
        document.getElementById("user-requests").style.display = none;

        //loading-animation
        //get request for all books
    })

    document.getElementById("requests").addEventListener("click", ()=> {
        
        document.getElementById("manage-catalog").style.display = none;
        document.getElementById("user-requests").style.display = block;

        //loading-animation
        //get request for user requests
    })

    document.getElementById("catalog-form").addEventListener("submit", (e)=>{

        e.preventDefault();
        const userType = document.getElementById("user-type").value;
        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("pasword").value;
        const cpassword = document.getElementById("cpassword").value;

        //post request to server

    })

    document.getElementById("prompt").addEventListener("click", ()=> {
        
        //document.getElementById("manage-catalog").style.display = none; change color
        document.getElementById("prompt").style.display = block;

        document.getElementById("prompt-form").addEventListener("submit", (e)=> {
            
            e.preventDefault();
            const bookName = document.getElementById("new-book").value;

            //post request to server

            //return same color for catalog

            document.getElementById("prompt").style.display = none;
        })
    })

    let booksToAdd = [];
    const addButton = document.getElementsByClassName("add");
    for(let i=0; i<addButton.length; i++) {
        addButton[i].addEventListener("click", ()=> {
            addButton[i].style.backgroundColor = "green";
            addButton[i].style.color = "white";

            booksToAdd.add(document.getElementsByClassName("cbook"[i].text));
        })
    }

    let booksToRemove = [];
    const removeButton = document.getElementsByClassName("remove");
    for(let i=0; i<removeButton.length; i++) {
        removeButton[i].addEventListener("click", ()=> {
            removeButton[i].style.backgroundColor = "red";
            removeButton[i].style.color = "white";

            booksToRemove.add(document.getElementsByClassName("cbook"[i].text));
        })
    }

    document.getElementById("catalog-form").addEventListener("submit", (e)=>{
        e.preventDefault();

        //post booksToRemove to server
    })

    let usersAccept = [];
    let usersDeny = [];
    const acceptButton = document.getElementsByClassName("accept");
    const denyButton = document.getElementsByClassName("deny");
    for(let i=0; i<denyButton.length; i++) {
        acceptButton[i].addEventListener("click", ()=> {
            acceptButton[i].style.backgroundColor = "green";
            acceptButton[i].style.color = "white";

            usersAccept.add(document.getElementsByClassName("user"[i].text));
        })
        
        denyButton[i].addEventListener("click", ()=> {
            denyButton[i].style.backgroundColor = "red";
            denyButton[i].style.color = "white";

            usersDeny.add(document.getElementsByClassName("user"[i].text));
        })
    }

    document.getElementById("catalog-form").addEventListener("submit", (e)=>{
        e.preventDefault();

        //post booksToAdd and booksToRemove to server
    })

    document.getElementById("user-requests-form").addEventListener("submit", (e)=>{
        e.preventDefault();

        //post userAccept to server
        //post userDeny to server
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