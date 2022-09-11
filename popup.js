let importBtn = document.querySelector(".import_btn");
let redirectBtn = document.querySelector(".redirect_btn");
let messanger = document.querySelector(".messanger");

async function getActiveTabUrl() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function toggleButtons(value) {
    messanger.innerHTML = "messanger: "+value;
    if (!importBtn && !redirectBtn) return;

    if (value) {
        importBtn.classList.remove("d-none");
        redirectBtn.classList.add("d-none");
    } else {
        importBtn.classList.add("d-none");
        redirectBtn.classList.remove("d-none");
    }

    importBtn.addEventListener("click", scrapeJobs);
}

document.addEventListener("DOMContentLoaded", async () => {

    const {url} = await getActiveTabUrl();
    const value = url.includes("linkedin.com/jobs/search");
    toggleButtons(value);
});
