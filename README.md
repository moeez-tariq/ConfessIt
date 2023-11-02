# ConfessIt - An Anonymous Confessions Platform
## Overview

(__TODO__: a brief one or two paragraph, high-level description of your project)

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
  username: "anonymousUser123",
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

(__TODO__: wireframes for all of the pages on your site; they can be as simple as photos of drawings or you can use a tool like Balsamiq, Omnigraffle, etc.)

/list/create - page for creating a new shopping list

![list create](documentation/list-create.png)

/list - page for showing all shopping lists

![list](documentation/list.png)

/list/slug - page for showing specific shopping list

![list](documentation/list-slug.png)

## Site map

(__TODO__: draw out a site map that shows how pages are related to each other)

Here's a [complex example from wikipedia](https://upload.wikimedia.org/wikipedia/commons/2/20/Sitemap_google.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

(__TODO__: write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format) and / or [use cases](https://en.wikipedia.org/wiki/Use_case))

1. as non-registered user, I can register a new account with the site
2. as a user, I can log in to the site
3. as a user, I can create a new grocery list
4. as a user, I can view all of the grocery lists I've created in a single list
5. as a user, I can add items to an existing grocery list
6. as a user, I can cross off items in an existing grocery list

## Research Topics

(__TODO__: the research topics that you're planning on working on along with their point values... and the total points of research topics listed)

* (5 points) Integrate user authentication
    * I'm going to be using passport for user authentication
    * And account has been made for testing; I'll email you the password
    * see <code>cs.nyu.edu/~jversoza/ait-final/register</code> for register page
    * see <code>cs.nyu.edu/~jversoza/ait-final/login</code> for login page
* (4 points) Perform client side form validation using a JavaScript library
    * see <code>cs.nyu.edu/~jversoza/ait-final/my-form</code>
    * if you put in a number that's greater than 5, an error message will appear in the dom
* (5 points) vue.js
    * used vue.js as the frontend framework; it's a challenging library to learn, so I've assigned it 5 points

10 points total out of 8 required points (___TODO__: addtional points will __not__ count for extra credit)


## [Link to Initial Main Project File](app.mjs) 

(__TODO__: create a skeleton Express application with a package.json, app.mjs, views folder, etc. ... and link to your initial app.mjs)

## Annotations / References Used

(__TODO__: list any tutorials/references/etc. that you've based your code off of)

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)

