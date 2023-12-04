// selenium-script.mjs
import { Builder, By, Key } from 'selenium-webdriver';
const globalDuration = 2000;

async function openInitialPage(driver) {
  await driver.get('http://localhost:3000');
  console.log('Web page opened.');
}

async function waitAndNavigateToSignup(driver, duration) {
  console.log(`Waiting for ${duration / 1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, duration));
  await driver.findElement(By.linkText('SIGN UP')).click();
  console.log('Navigated to the signup page.');
}

async function fillAndSubmitSignupForm(driver, username, name, password, duration) {
  await driver.findElement(By.name('username')).sendKeys(username);
  await new Promise(resolve => setTimeout(resolve, duration / 2));
  await driver.findElement(By.name('name')).sendKeys(name);
  await new Promise(resolve => setTimeout(resolve, duration / 2));
  await driver.findElement(By.name('password')).sendKeys(password);
  await new Promise(resolve => setTimeout(resolve, duration / 2));
  console.log(`Form filled. Waiting for ${duration / 1000} seconds...`);
  await new Promise(resolve => setTimeout(resolve, duration));

  await driver.findElement(By.name('password')).sendKeys(Key.RETURN);
  console.log('Signup form submitted.');
}

async function fillAndSubmitLoginForm(driver, username, password, duration) {
  await driver.findElement(By.name('username')).sendKeys(username);
  await new Promise(resolve => setTimeout(resolve, duration / 2));
  await driver.findElement(By.name('password')).sendKeys(password);
  await new Promise(resolve => setTimeout(resolve, duration / 2));

  await driver.findElement(By.name('password')).sendKeys(Key.RETURN);
  console.log('Login form submitted.');
}

async function navigateToAddConfessionTab(driver, duration) {
    await new Promise(resolve => setTimeout(resolve, duration));
    await driver.findElement(By.id('addConfession')).click();
    console.log('Navigated to Add Confession tab.');
}

async function fillAndSubmitConfessionForm(driver, confession, duration) {
    await new Promise(resolve => setTimeout(resolve, duration));
    await driver.findElement(By.name('content')).sendKeys(confession);
    await new Promise(resolve => setTimeout(resolve, duration / 2));
    await driver.findElement(By.className('btn btn1')).click();
    console.log('Confession form submitted.');
}

async function likeConfession(driver, duration) {
    await new Promise(resolve => setTimeout(resolve, duration));
    const likeButton = await driver.findElement(By.className('like-btn'));
    await likeButton.click();
    console.log('Liked the confession.');
}

async function dislikeConfession(driver, duration) {
    await new Promise(resolve => setTimeout(resolve, duration));
    const likeButton = await driver.findElement(By.className('dislike-btn'));
    await likeButton.click();
    console.log('Disliked the confession.');
}

async function navigateToHomePage(driver, duration) {
    await new Promise(resolve => setTimeout(resolve, duration));
    await driver.findElement(By.id('home')).click()
    console.log('Navigated to home page.');
}

async function navigateToAddDiaryTab(driver, duration) {
    await new Promise(resolve => setTimeout(resolve, duration));
    await driver.findElement(By.id('addDay')).click()
    console.log('Navigated to add diary tab.');
}

async function fillAndSubmitDiaryForm(driver, diary, duration) {
    await new Promise(resolve => setTimeout(resolve, duration));
    await driver.findElement(By.name('content')).sendKeys(diary);
    await new Promise(resolve => setTimeout(resolve, duration / 2));
    await driver.findElement(By.className('btn btn1')).click();
    console.log('Diary form submitted.');
}

async function generateRandomName() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let randomName = '';
  
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      randomName += alphabet.charAt(randomIndex);
    }
    return randomName;
}

async function navigateToFeedbackPage(driver, duration) {
  await new Promise(resolve => setTimeout(resolve, duration));
  await driver.findElement(By.id('feedback')).click();
  console.log('Navigated to feedback page.');
}

async function fillAndSubmitFeedbackForm(driver, feedback, duration) {
  await new Promise(resolve => setTimeout(resolve, duration));
  await driver.findElement(By.name('content')).sendKeys(feedback);
  await new Promise(resolve => setTimeout(resolve, duration / 2));
  await driver.findElement(By.className('btn btn1')).click();
  console.log('Feedback form submitted.');
}

async function logout(driver, duration) {
  await new Promise(resolve => setTimeout(resolve, duration));
  await driver.findElement(By.id('logout')).click();
  console.log('Logged out.');
}
  
async function runScript() {
    const driver = await new Builder().forBrowser('chrome').build();
  
    try {
        const name = await generateRandomName();
    
        await openInitialPage(driver);
        await waitAndNavigateToSignup(driver, globalDuration);
        await fillAndSubmitSignupForm(driver, 'User_'+name, name, 'Testpassword123', globalDuration);
        await fillAndSubmitLoginForm(driver, 'User_'+name, 'Testpassword123', globalDuration);
        await navigateToAddConfessionTab(driver, globalDuration);
        await fillAndSubmitConfessionForm(driver, 'Hello World', globalDuration);
        // await likeConfession(driver, globalDuration);
        // await dislikeConfession(driver, globalDuration);
        // await likeConfession(driver, globalDuration);
        await navigateToHomePage(driver, globalDuration);
        await navigateToAddDiaryTab(driver, globalDuration);
        await fillAndSubmitDiaryForm(driver, 'Hello Diary', globalDuration);
        await navigateToHomePage(driver, globalDuration);
        await navigateToFeedbackPage(driver, globalDuration);
        await fillAndSubmitFeedbackForm(driver, 'Great website!', globalDuration);
        await navigateToHomePage(driver, globalDuration);
        await logout(driver, globalDuration);

        console.log('\nPress Ctrl+C to exit the script.');
        await new Promise(() => {});
    } finally {
      await driver.quit();
    }
  }
  
  runScript();
  