let importBtn = document.querySelector(".import_btn");
let redirectBtn = document.querySelector(".redirect_btn");
let messanger = document.querySelector(".messanger");
let token = "";
let isLoading = false;
let baseUrl = "https://personarise-api.onrender.com/";


async function getActiveTabUrl() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function getToken() {
    const token = await chrome.cookies.get({
        name: "x-token",
        url: "https://jobdude.netlify.app/"
    })
    return token?.value;
}

function toggleButtons(value) {
    // messanger.innerHTML = "messanger: " + value;
    if (!importBtn && !redirectBtn) return;

    if (value) {
        importBtn.classList.remove("d-none");
        redirectBtn.classList.add("d-none");
    } else {
        importBtn.classList.add("d-none");
        redirectBtn.classList.remove("d-none");
    }

}

importBtn.addEventListener("click", async () => {
    const { id, url } = await getActiveTabUrl();
    const token = await getToken()
    chrome.tabs.sendMessage(id, {
        message: "SCRAPE",
        url,
    }, function ({ data }) {
        importJobs(data, token);
        return true;
    })
});

async function resetMessanger() {
    const token = await getToken();
    if(token){
        notifyConnected(token);
    } else {
        alertWarning(token)
    }
    
}

function messangerController(type, message) {

    switch (type) {
        case "success":
            messanger.classList.remove("text-danger");
            messanger.classList.remove("text-secondary");
            messanger.classList.remove("text-warning");
            messanger.classList.add("text-success");
            messanger.innerHTML = message;

            setTimeout(resetMessanger, 5000);

            break;
        case "fail":
            messanger.classList.remove("text-success");
            messanger.classList.remove("text-warning");
            messanger.classList.remove("text-secondary");
            messanger.classList.add("text-danger");
            messanger.innerHTML = message;

            setTimeout(resetMessanger, 5000);

            break;
        case "loading":
            messanger.classList.remove("text-success");
            messanger.classList.remove("text-danger");
            messanger.classList.remove("text-warning");
            messanger.classList.add("text-secondary");
            messanger.innerHTML = message;

            break;
        case "connection":
            messanger.classList.remove("text-success");
            messanger.classList.remove("text-danger");
            messanger.classList.remove("text-secondary");
            messanger.classList.add("text-warning");
            messanger.innerHTML = message;
            break;
        case "connected":
            messanger.classList.remove("text-danger");
            messanger.classList.remove("text-secondary");
            messanger.classList.remove("text-warning");
            messanger.classList.remove("text-success");
            messanger.innerHTML = message;
            break;
        default:
            break;
    }
}

async function importJobs(data, token) {
    if (!data) return;
    if(token){
        notifyConnected(token);
    } else {
        alertWarning(token)
        return
    }
    
    isLoading = true;
    messangerController("loading", "Processing your request...")

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({jobs: data}),
    };

    try {
        const res = await fetch(baseUrl + "api/jobs", options);
        const {status, message} = await res.json()
        isLoading = false;
        console.log(status, message)
        messangerController(status, message)
    } catch (error) {
        console.error(error.message);
        isLoading = false;
        const {status, message} = error.message;
        messangerController(status, message)
    }

}

function alertWarning(token) {
    if (!token) {
        messangerController("connection", "You are not connected to your dashboard, please click the home button above")
    }
}

function notifyConnected(token) {
    if(token){
        messangerController("connected", "connected")
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const { url } = await getActiveTabUrl();
    const value = url.includes("linkedin.com/jobs/search");
    toggleButtons(value);
    const token = await getToken();
    if(token){
        notifyConnected(token);
    } else {
        alertWarning(token)
    }
    
});
