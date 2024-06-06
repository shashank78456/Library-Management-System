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

    document.getElementById("reqadmin").addEventListener("click", () => {

        //post to server
    });

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
                'Content-Type': 'application/json'
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

adminHandler();
