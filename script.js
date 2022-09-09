(()=> {
    let jobsContainer = document.querySelectorAll(".scaffold-layout__list-container > li")
    // let jobsContainer = document.querySelector(".jobs-search-results__list-item")
    let titleContainer = document.getElementsByClassName("job-card-list__title")
    let locationContainer = document.getElementsByClassName("job-card-container__company-name")
    let allContainer = document.getElementsByClassName("artdeco-entity-lockup__content")
    let linkContainer = document.getElementsByClassName("job-card-container__link")


    let elem = document.createElement('script');
    elem.src = "https://code.jquery.com/jquery-3.6.1.min.js";
    elem.integrity = "sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=";
    elem.crossOrigin = "anonymous";
    // document.body.appendChild(elem);

    let jobs = [];

    // $('.scaffold-layout__list-container > li').each((i, el)=> {
    //     const title = $(el).find(".job-card-list__title").text().trim()
    //     const location = $(el).find(".job-card-container__metadata-item").text().replaceAll("\n", "-").replace("-", "").replaceAll(/\s/g, '').replace("--", "_").replaceAll("-", "").replace("_", " - ")
    //     const company = $(el).find(".job-card-container__company-name").text().trim()
    //     const jobId = $(el).find(".job-card-container ").attr('data-job-id')

    //     if(title){
    //         jobs.push({title, company, location, jobId})
    //     }
    // })
    [...jobsContainer].forEach((el, i) => {
        const title = document.querySelectorAll(".job-card-list__title")[i]?.innerHTML.trim()
        const location = document.querySelectorAll(".job-card-container__metadata-item:first-child")[i]?.innerHTML.trim()
        const company = document.querySelectorAll(".job-card-container__company-name")[i]?.innerHTML.trim()
        const jobId = document.querySelectorAll(".job-card-container")[i]?.getAttribute('data-job-id').trim()
        
        if(title){
            jobs.push({title, company, location, jobId})
        }

    })
    console.log(jobs);





})()