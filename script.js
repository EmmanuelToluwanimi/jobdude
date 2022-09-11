(async () => {
  let jobsContainer = document.querySelectorAll(
    ".scaffold-layout__list-container > li"
  );
  // let jobsContainer = document.querySelector(".jobs-search-results__list-item")
  let titleContainer = document.getElementsByClassName("job-card-list__title");
  let locationContainer = document.getElementsByClassName(
    "job-card-container__company-name"
  );
  let allContainer = document.getElementsByClassName(
    "artdeco-entity-lockup__content"
  );
  let linkContainer = document.getElementsByClassName(
    "job-card-container__link"
  );
  let importBtn = document.querySelector(".import_btn");
  let redirectBtn = document.querySelector(".redirect_btn");

  
  let token = "";
  let isCorrectUrl = false;

  let jobs = [];
  let baseUrl = "https://personarise-api.onrender.com/";

  const myTimeout = setTimeout(scrapeJobs, 5000);


  function scrapeJobs() {
    if(!jobsContainer || jobsContainer.length === 0) {
      console.log("No jobs container specified");
      return;
    }

    [...jobsContainer].forEach((el, i) => {
      const title = document
        .querySelectorAll(".job-card-list__title")
        [i]?.innerHTML.trim();
      const location = document
        .querySelectorAll(".job-card-container__metadata-item:first-child")
        [i]?.innerHTML.trim();
      const company = document
        .querySelectorAll(".job-card-container__company-name")
        [i]?.innerHTML.trim();
      const jobId = document
        .querySelectorAll(".job-card-container")
        [i]?.getAttribute("data-job-id")
        .trim();
  
      if (title) {
        jobs = [...jobs, { title, company, location, jobId }];
      }
    });
    
    console.log(jobs);

    // setTimeout(() => {
    //   importJobs()
    // }, 2000);

  }

  let _url = window.location.hostname;
  if (_url.includes("jobdude.netlify.app")) {
    token = getCookie("x-token");
  }

  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function importJobs() {
    if (jobs.length === 0) return;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobs),
    };
    fetch(baseUrl + "api/jobs", options);
  }

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // listen for messages sent from background.js
      if (request.message === 'hello!') {
        console.log(request.url) // new url is now in content scripts!
        console.log("nopeeeeeeeeeeeeeeeeeeee")
        if(request.url.includes('linkedin.com/jobs/search')){
          console.log("yessssssssssssssssssssssssssssssss")
          const myTimeout = setTimeout(scrapeJobs, 5000);

        } 
      }
  });

  function toggleButtons(value){

    if(!importBtn && !redirectBtn) return;

    if(value){
      importBtn.classList.remove(".d-none");
      redirectBtn.classList.add(".d-none");
    } else {
      importBtn.classList.add(".d-none");
      redirectBtn.classList.remove(".d-none");
    }

    importBtn.addEventListener("click", scrapeJobs)

  }

  function checkUrl() {
    const url = window.location.href
    const value = url.includes("linkedin.com/jobs/search")
    toggleButtons(value)
  }
  checkUrl();


})();
