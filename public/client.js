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
        let booksToBorrow = [];
        const borrowBooks = document.getElementsByClassName("borrow")
        for(let i=0; i<borrowBooks.length; i++) {
            booksToBorrow.add(borrowBooks[i].value);
        }

        await post(`https://localhost:3000/client/home`, {books: booksToBorrow});
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

clientHandler();