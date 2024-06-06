function adminHandler(){

    document.getElementById("catalog").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/admin/home`;
    })

    document.getElementById("requests").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/admin/requests`;
    })

    try {
        document.getElementById("prompt-open").addEventListener("click", async ()=> {
            window.location.href = `http://localhost:3000/admin/add`;
        })
    }
    catch{};

    try {
    document.getElementById("adreq").addEventListener("click", async ()=> {
        window.location.href = `http://localhost:3000/admin/adreq`;
    })
    }
    catch{};

    try {
    document.getElementById("prompt-form").addEventListener("submit", async (e)=> {
        e.preventDefault();
        const bookName = document.getElementById("new-book").value;
        await post({book: bookName}, `http://localhost:3000/admin/add`);
        window.alert("Added Succesfully");
        window.location.href = `http://localhost:3000/admin/home`;
    })
    }
    catch{};

    try {
    const addButton = document.getElementsByClassName("add");
    for(let i=0; i<addButton.length; i++) {
        addButton[i].addEventListener("click", async (e)=> {
            e.preventDefault();
            await post({book: addButton[i].value, isAccepted: true}, `http://localhost:3000/admin/home`);
            window.alert("Added Successfully");
            window.location.href = `http://localhost:3000/admin/home`;
        })
    }
    
    const removeButton = document.getElementsByClassName("remove");
    for(let i=0; i<removeButton.length; i++) {
        removeButton[i].addEventListener("click", async (e)=> {
            e.preventDefault();
            await post({book: addButton[i].value, isAccepted: false}, `http://localhost:3000/admin/home`);
            window.alert("Removed Successfully");
            window.location.href = `http://localhost:3000/admin/home`;
        })
    }

    }
    catch{};

    try {
    const acceptButton = document.getElementsByClassName("accept");
    const denyButton = document.getElementsByClassName("deny");
    for(let i=0; i<acceptButton.length; i++) {
        acceptButton[i].addEventListener("click", async ()=> {
            await post({book: denyButton[i].value, user: acceptButton[i].value, isAccepted: true}, `http://localhost:3000/admin/requests`);
            window.alert("Accepted Successfully");
            window.location.href = `http://localhost:3000/admin/requests`;
        })
    }

    for(let i=0; i<denyButton.length; i++) {
        denyButton[i].addEventListener("click", async (e)=> {
            e.preventDefault();
            await post({book: denyButton[i].value, user: acceptButton[i].value, isAccepted: false}, `http://localhost:3000/admin/requests`);
            window.alert("Denied Successfully");
            window.location.href = `http://localhost:3000/admin/requests`;
        })
    }

    }
    catch{};

    try {
    const acceptButtonR = document.getElementsByClassName("acceptR");
    const denyButtonR = document.getElementsByClassName("denyR");
    for(let i=0; i<acceptButtonR.length; i++) {
        acceptButtonR[i].addEventListener("click", async ()=> {
            await post({user: acceptButtonR[i].value, isAccepted: true}, `http://localhost:3000/admin/adreq`);
            window.alert("Accepted Successfully");
            window.location.href = `http://localhost:3000/admin/adreq`;
        })
    }
    
    for(let i=0; i<denyButtonR.length; i++) {
        denyButtonR[i].addEventListener("click", async ()=> {
            await post({user: denyButtonR[i].value, isAccepted: false}, `http://localhost:3000/admin/adreq`);
            window.alert("Denied Successfully");
            window.location.href = `http://localhost:3000/admin/adreq`;
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

adminHandler();
