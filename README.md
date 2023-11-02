# ConfessIt - An Anonymous Confessions Platform
## Overview

Have you ever felt the need to unburden your soul without fear of judgment or exposure? Welcome to ConfessIt, the haven for your deepest secrets and unspoken thoughts. ConfessIt is an anonymous confessions web application that empowers users to share their innermost secrets, candid thoughts, and heartfelt confessions without the fear of revealing their true identity. Within the walls of ConfessIt, users can freely express themselves, explore the confessions of others, and engage with a community that cherishes anonymity at its core.

But ConfessIt goes beyond just a confessions platform. It provides you with a private sanctuary, a digital diary where you can pour out your emotions and thoughts in complete anonymity. This unique 'Diary' section allows you to keep a personal record of your inner journey, unfiltered and free from prying eyes. ConfessIt is not just a confessions platform; it's your secret refuge and a judgment-free diary rolled into one.
## Data Model

The ConfessIt application will have three main data entities: Users, Diaries, and Confessions, each with its own set of attributes.

1. Users:

Users are the individuals who create accounts and interact with the platform.
Each user has the following attributes:
* username: A unique username chosen by the user while signup.
* hash: A password hash to secure the user's account.
* diary: A reference to the user's personal diary document.
* confessions: An array of references to Confession documents posted by the user.

```javascript
{
  username: "abc123",
  hash: // a password hash,
  diary: // a reference to the user's Diary document,
  confessions: // an array of references to Confession documents
}
```

2. Diary:

The Diary entity represents the user's private space to record personal thoughts and reflections.
Each diary document includes:
* user: A reference to the User who owns the diary.
* entries: An array of diary entries, each containing a timestamp and the content of the entry.

```javascript
{
  user: // a reference to the User document,
  entries: [
    { content: "Today, I felt...", timestamp: /* timestamp */},
    { content: "A secret I've been carrying...", timestamp: /* timestamp */ },
  ]
}
```

3. Confessions:

Confessions represent the public, anonymous disclosures made by users.
Each confession includes:
* user: A reference to the User who posted the confession.
* content: The text content of the confession.
* likes: The number of users who liked the confession.
* dislikes: The number of users who disliked the confession.

```javascript
{
  user: // a reference to the User document,
  content: "I did something I'm not proud of...",
  timestamp: // timestamp,
  likes: // number of users who liked the confession,
  dislikes: // number of users who disliked the confession
}
```
## [Link to Commented First Draft Schema](db.mjs) 

## Wireframes

/ - main page when user is not logged in

![list create](documentation/IMG_7054.png)

/signin - page for when user is trying to sign in

![list](documentation/IMG_7055.png)

/signup - page for when user is trying to sign up

![list](documentation/IMG_7056.png)

/home - page for home when user is signed in

![list](documentation/IMG_7057.png)

/confessions - page for all the public confessions

![list](documentation/IMG_7059.png)

/addConfession - page for when user is trying to add a confessions

![list](documentation/IMG_7058.png)

/diary - page for when user is trying to access their diary

![list](documentation/IMG_7060.png)

/addToDiary - page for when user is trying to add another log to their diary

![list](documentation/IMG_7061.png)

/feedback - page for when user is giving feedback

![list](documentation/IMG_7063.png)

## Site map
## [Link to Site Map](documentation/site_map.png)

## User Stories or Use Cases

1. As an unregistered user, I can register for an account with a unique username and a secure password.
2. As a registered user, I can log in to my account.
3. As a user, I can submit a confession, including the content of my confession.
4. As a user, I can view confessions posted by others in the Confession Feed.
5. As a user, I can like a confession to show support for the author.
6. As a user, I can dislike a confession to express my disapproval.
7. As a user, I can view the details of a confession, including its content, the number of likes, and dislikes.
8. As a user, I can add personal diary entries to my Diary.
9. As a user, I can view my personal diary entries in the Diary section.
10. As a user, I can maintain my anonymity while using the platform, ensuring my identity remains confidential.

## Research Topics

* (3 points) Unit Testing with Mocha
  * Mocha is a JavaScript test framework for writing unit tests.
  * It will help me in a structured way to verify that individual units of code function correctly.
* (3 points) Configuration Management with dotenv
  * dotenv is a Node.js module for managing environment variables and configuration settings.
  * It will help me simplify the management of environment-specific configuration settings.
* (5 points) Automated Functional Testing
  * Selenium is a tools for automated functional testing.
  * It will help me automate functional testing which will ensure application functionality across different scenarios.
* (3 points) Integrate user authentication
  * Passport.js is a popular authentication library for Node.js.
  * It provides a secure and flexible way to implement user authentication.

14 points total out of 10 required points


## [Link to Initial Main Project File](app.mjs) 

## Annotations / References Used

* Mocha - [https://mochajs.org/]- Reference for Mocha, the JavaScript test framework used for unit testing.
* dotenv - [https://www.npmjs.com/package/dotenv] - Reference for dotenv, the module used for configuration management.
* Selenium - [https://www.selenium.dev/] - Reference for Selenium, the automated functional testing tool.
* Passport.js - [https://www.passportjs.org/docs/] - Reference for Passport.js, the library used for user authentication in Node.js applications.
