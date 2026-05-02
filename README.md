# CS208 Full Stack Final Project

A prototype website for Downtown Donuts, a hypothetical client proposal. Goal was to demonstrate full-stack development skills.

## Setup Instructions

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm start` to start the development server.
4. Open `http://localhost:3000/landing` in a browser.

The following pages are available:

- `/landing` — Homepage
- `/menu` — Full menu with donuts, coffee, drinks, and breakfast items
- `/about` — Shop history and story
- `/comments` — Customer comments with full-stack functionality

## Design Decisions

## Menu

I recreated the menu.pdf styling in CSS, mostly because I did not think a download link was sufficient and did not like the way embedding the pdf changed the formatting, The menu styling was also ultimately the styling for the footer on each page.

### JSON Database for comments

The starter code included middleware that crashed on machines w/out MySQL installed. Removing the `dbMiddleware` reference from `app.js` and the `createDbConnection` call from `bin/www` allowed the server to run off codespaces. Was able to replace database functionality with standard node.js. Comments are stored in `data/comments.json` rather than a database. This removes the MySQL dependency from the starter template, while still satisfying the requirement for server-side storage, validation, and retrieval.

## Edge Cases

### Server unreachable

If the comments API is down, the `form.addEventListener` catches fetch failures and `showFeedback` displays the error in the feedback area. Also a `Retry` button appears on a `loadComments` catch.

### Whitespace-only submission

The server trims input and rejects empty strings after trimming. The user sees "Name cannot be empty." or "Comment cannot be empty."
### Extremely long input

Used `maxlength` attribute to reject submissions by character count (names > 100, comments > 1000) and push error message.

### Rapid double-click on submit

Disabled `submit` button after click to prevent duplicate submissions. Re-enabled after the request completes.

### Cross-Site Scripting (XSS) prevention

The `validation.js` middleware sanitizes entries by scrubbing `<` and `>` to prevent hackers injecting unauthorized script

## Challenges and Learnings

### Template engine

I really love pug,the simplified tagging versus HTML makes it much faster and cleaner to work with ultimately. The class inheritance functionality is super useful. The strict tab indent syntax could get tricky, without the closing tags or curly braces of HTML or javascript and the lack of compilation error messages it was sometimes difficult to debug visible issues or even run into invisible ones.

### Complex Page Styling

Styling the menu page to resemble the .pdf was more difficult than expected especially from a mobile-first perspective. My problem with using the embedded pdf was ugly scrolling and after some tinkering I wasn't able to remove scrolling completely by rendering the menu in pug tables but I feel it's less invasive and more intuitive now. 

### Demystification of Full-Stack development

I feel relatively confident that I could create a prototype similar to this in a professional environment for a client, where prior to this class and project I would have been way out of my depth.


## Citations

- https://nodejs.org/api/fs.html
- https://css-tricks.com/complete-guide-table-element/
- https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Styling_tables
- https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media)
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
` https://google.com and https://google.com/gemini