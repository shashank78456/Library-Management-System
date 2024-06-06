function clientHandler(){

    document.getElementById("reqadmin").addEventListener("click", async () => {
        await post(`http://localhost:3000/client/admin_request`, {hasRequested: true});
    });

    document.getElementById("view").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/client/home`;
    })
    
    document.getElementById("return").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/client/return`;
    })

    document.getElementById("borrow").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/client/history`;
    })

    document.getElementById("borrow-form").addEventListener("submit", async (e)=>{

        e.preventDefault();
        let booksToBorrow = [];
        const borrowBooks = document.getElementsByClassName("borrow")
        for(let i=0; i<borrowBooks.length; i++) {
            booksToBorrow.add(borrowBooks[i].value);
        }

        await post(`http://localhost:3000/client/home`, {books: booksToBorrow});
    })

    document.getElementById("return-form").addEventListener("submit", async (e)=>{

        e.preventDefault();
        const returnBooks = document.getElementsByClassName("return");
        let booksToReturn = [];
        for(let i=0; i<returnBooks; i++) {
             booksToReturn.add(returnBooks.value);
        }

        await post(`http://localhost:3000/client/return`, {booksToReturn: booksToReturn});
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

clientHandler();