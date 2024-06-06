function clientHandler(){

    document.getElementById("reqadmin").addEventListener("click", async () => {
        await post({hasRequested: true}, `http://localhost:3000/client/adreq`);
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

    try {
    const borrowBooks = document.getElementsByClassName("borrow");
    for(let i=0; i<borrowBooks.length; i++) {
        borrowBooks[i].addEventListener("click", async () => {
            await post({book: borrowBooks[i].value}, `http://localhost:3000/client/home`);
            window.alert("Requested Successfully");
            window.location.href = `http://localhost:3000/client/home`;
        })
    }
    }
    catch{};

    try {
        const returnBooks = document.getElementsByClassName("return");
        for(let i=0; i<returnBooks.length; i++) {
            returnBooks[i].addEventListener("click", async () => {
                await post({bookToReturn: returnBooks[i].value}, `http://localhost:3000/client/return`);
                window.alert("Returned Successfully");
                window.location.href = `http://localhost:3000/client/return`;
            })
        }
    }
    catch{};
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
            resolve(response);
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