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

  let jobs = [];

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
    return jobs;
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
      const allJobs = scrapeJobs();
      sendResponse({data: allJobs});
      return true;
    }
  });

})();
