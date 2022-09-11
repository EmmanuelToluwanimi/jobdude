(async () => {
  let jobsContainer = document.getElementsByClassName(
    "scaffold-layout__list-item"
  );
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

  function scrapeJobs() {
    if (!jobsContainer || jobsContainer.length === 0) {
      console.log("No jobs container specified");
      return;
    }
    console.log(jobsContainer.length);

    [...jobsContainer].forEach((el, i) => {
      const title = el
        .querySelectorAll(".job-card-list__title")[0]
        ?.innerHTML.trim();
      const job_location = el
        .querySelectorAll(".job-card-container__metadata-item")[0]
        ?.innerHTML.trim();
      const job_type = el
      .querySelectorAll(".job-card-container__metadata-item")[1]
      ?.innerHTML.trim();
      const company = el
        .querySelectorAll(".job-card-container__company-name")[0]
        ?.innerHTML.trim();
      const jobId = el
        .querySelectorAll(".job-card-container")[0]
        ?.getAttribute("data-job-id")
        .trim();

      if (title) {
        jobs = [...jobs, { title, company, jobId, location: `${job_location} - ${job_type}` }];
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

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    // listen for messages sent from background.js
    const validateTab = request.url.includes("linkedin.com/jobs/search");
    if (!validateTab) return;

    if (request.message === "hello!") {
      console.log(request.url); // new url is now in content scripts!
    } else if (request.message === "SCRAPE") {
      scrapeJobs();
    }
  });

  function toggleButtons(value) {
    if (!importBtn && !redirectBtn) return;

    if (value) {
      importBtn.classList.remove(".d-none");
      redirectBtn.classList.add(".d-none");
    } else {
      importBtn.classList.add(".d-none");
      redirectBtn.classList.remove(".d-none");
    }
  }

  function checkUrl() {
    const url = window.location.href;
    const value = url.includes("linkedin.com/jobs/search");
    toggleButtons(value);
  }
  checkUrl();
})();
