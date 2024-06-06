function adminHandler(){

    document.getElementById("catalog").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/admin/home`;
    })

    document.getElementById("requests").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/admin/requests`;
    })

    document.getElementById("prompt").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/admin/add`;
    })

    document.getElementById("adreq").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/admin/adreq`;
    })

    document.getElementById("prompt-form").addEventListener("submit", async (e)=> {
            
        e.preventDefault();
        const bookName = document.getElementById("new-book").value;
        await post({book: bookName}, `http://localhost:3000/admin/add`); 
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
                booksToAdd.add(document.getElementsByClassName("add")[i].value);
            }
            else{
                isAddClicked[i]=false;
                addButton[i].style.backgroundColor = "white";
                addButton[i].style.color = "black";
                delete booksToAdd[booksToAdd.indexOf(document.getElementsByClassName("add")[i].value)];
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
                booksToRemove.add(document.getElementsByClassName("remove")[i].value);
            }
            else {
                isRemoveClicked=false;
                removeButton[i].style.backgroundColor = "white";
                removeButton[i].style.color = "black";
                delete booksToRemove[booksToRemove.indexOf(document.getElementsByClassName("remove")[i].value)];
            }
        })
    }

    document.getElementById("catalog-form").addEventListener("submit", async (e)=>{
        e.preventDefault();

        await post({booksToAdd: booksToAdd, booksToRemove: booksToRemove}, `http://localhost:3000/admin/home`);
    })

    let usersAccept = [];
    let bookAccept = [];
    let usersDeny = [];
    let bookDeny = [];
    const acceptButton = document.getElementsByClassName("accept");
    const denyButton = document.getElementsByClassName("deny");
    for(let i=0; i<acceptButton.length; i++) {
        acceptButton[i].addEventListener("click", ()=> {
            acceptButton[i].style.backgroundColor = "green";
            acceptButton[i].style.color = "white";

            usersAccept.add(document.getElementsByClassName("accept")[i].value);
            bookAccept.add(document.getElementsByClassName("deny")[i].value);
        })
    }

    for(let i=0; i<denyButton.length; i++) {
        denyButton[i].addEventListener("click", ()=> {
            denyButton[i].style.backgroundColor = "red";
            denyButton[i].style.color = "white";

            usersDeny.add(document.getElementsByClassName("accept")[i].value);
            bookDeny.add(document.getElementsByClassName("deny")[i].value);
        })
    }

    document.getElementById("user-requests-form").addEventListener("submit", async (e)=>{
        e.preventDefault();

        await post({usersAccept: usersAccept, bookAccept: bookAccept, usersDeny: usersDeny, bookDeny:bookDeny}, `https://localhost:3000/admin/requests`);
    })

    let usersAcceptR = [];
    let usersDenyR = [];
    const acceptButtonR = document.getElementsByClassName("accept");
    const denyButtonR = document.getElementsByClassName("deny");
    for(let i=0; i<acceptButtonR.length; i++) {
        acceptButtonR[i].addEventListener("click", ()=> {
            acceptButtonR[i].style.backgroundColor = "green";
            acceptButtonR[i].style.color = "white";

            usersAcceptR.add(document.getElementsByClassName("accept")[i].value);
        })
    }
    
    for(let i=0; i<denyButtonR.length; i++) {
        denyButtonR[i].addEventListener("click", ()=> {
            denyButtonR[i].style.backgroundColor = "red";
            denyButtonR[i].style.color = "white";

            usersDenyR.add(document.getElementsByClassName("deny")[i].value);
        })
    }

    document.getElementById("adreq-form").addEventListener("submit", async (e)=>{
        e.preventDefault();

        await post({usersAcceptR: usersAcceptR, usersDenyR: usersDenyR}, `https://localhost:3000/admin/adreq`);
    })
}

async function post(data, url) {
    return new Promise((resolve) => {
        fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            resolve(response.json());
        })
        .catch(error => {
            console.error(error);
        });
    });
}


async function get(url) {
    return new Promise((resolve) => {
        fetch(url)
        .then(response => {
            resolve(response);
        })
        .catch(error => console.error(error));
    });
}

adminHandler();
