# TwitterTrends / App for learn NodeJS

This application allows to a user to choose among all of twitter trends in order to compare them over time.


## Installation

1. install the dependencies of the project.

```bash
$ npm install
```

2. launch the app.
```bash
$ node index.js
```

3. and launch [localhost:8080](localhost:8080) on your favorite browser.



## Architecture

```
├─┐ public/
│ ├── index.html # make the client structure.
│ ├── script.js # make the client animated.
│ ├── style.css # make the client beautiful.
├─┐ trends/
| ├── index.js # get the last twitter trends.
├─┐ twitter/
| ├── index.js # get filtered tweets according to the user selection.
| ├── logger.js # display results in console for debug.
| ├── parser.js # tranforms a string tweet into a json tweet in order to treat him after for the client side.
| ├── splitter.js # transforms a huge string in many strings contains only a tweet in order to parse them after.
├── .env.example # management of env vars for a better security.
├── index.js # conversation between the client and the server.
├── server.js # server creation.

```
