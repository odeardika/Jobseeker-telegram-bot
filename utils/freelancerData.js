import puppeteer from "puppeteer";
import { timeout } from "puppeteer";

export const getFreelancerData = async (category) => {
    const url = `https://www.freelancer.com/jobs/${category}`;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);

    const jobs = await page.evaluate(() => {
        const jobList = Array.from(document.querySelectorAll('.JobSearchCard-item ')).map(job => {
            return {
                title: job.querySelector('.JobSearchCard-primary-heading-link').innerText,
                timeout: job.querySelector('.JobSearchCard-primary-heading-days').innerText,
                bids: Array.from(job.querySelectorAll('.JobSearchCard-primary-price, .JobSearchCard-secondary-price'))
                .map(el => el.firstChild?.textContent.trim()),

            }; 
        });
        return jobList;
    });

    await browser.close();

    return jobs;

}

getFreelancerData('web-development').then(data => console.log(data)).catch(err => console.log(err));