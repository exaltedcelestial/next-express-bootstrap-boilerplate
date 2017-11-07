# next-express-bootstrap-boilerplate
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)



## TL;DR.
Boilerplate code to get you up and running quickly with a full stack JavaScript web application whose frontend is built with <b>[React.js](https://reactjs.org/)</b>, <b>[Next.js](https://github.com/zeit/next.js)</b>, <b>[Bootstrap](https://react-bootstrap.github.io/)</b> and <b>[SCSS](http://sass-lang.com/)</b> and backend is built using <b>[Express.js](https://expressjs.com/)</b>. React code is isomorphic and the components are rendered both on the server with <b>Server Side Rendering</b> (SSR) and as well as on the browser.
<br />
<br />

## Installation.
• First clone the repo. `git clone https://github.com/MustansirZia/next-express-bootstrap-boilerplate`.

• `cd next-express-bootstrap-boilerplate`.


• `npm i` or if you have yarn `yarn`.

• `npm run dev` or if you have yarn `yarn dev`. (For development)

• `npm start` or if you have yarn `yarn start`. (For production) | `start` script will first build the app and then serve the production version at `:9001`.

• Go to `localhost:9001` to verify.
<br />
<br />

## App structure.
```
|-- app                     // Next.js app lives here.
|  |
|  `-- components           // Common components live here.
|  |  |
|  |  `-- Theme.js
|  |
|  `-- pages                // App routes live here.
|  |  |
|  |  `-- index.js
|  |  |
|  |  `-- profile.js
|  |
|  `-- styles               // CSS and SCSS files live here.
|  |  |
|  |  `-- index.scss
|  |  |
|  |  `-- vendor
|  |     |
|  |     `-- bootstrap.min.css
|  |
|  `-- .babelrc					
|  |
|  `-- next.config.js       // App config lives here.
|  |
|  `-- postcss.config.js   
|
|
`-- app.js
|
`-- next.js
|
`-- package.json
|
`-- README.md
|
`-- LICENSE
```


Our React app is housed under `app/`. Since it uses Next.js, all the main app routes go under `app/pages`. The common or miscellaneous components are housed under `app/components`.
<br />

Next.js uses [styled-jsx](https://github.com/zeit/styled-jsx) to apply styles to our components. It is a css-in-js solution and will work inside this boilerplate too. But apart from this, we can write our own individual `css` or `scss` files for each of our components and place them under `app/styles`.
We can later on import these style files just as we do in plain react but we need to put them inside `<style>` tags for them to work. (Since that's how Next.js handles all the styling).
<br />

As you can see our `bootstrap.min.css` is also housed under `app/styles/vendor` and is loaded inside a HOC called `Theme`. We essentially load all the bootstrap styling into this component and make it a wrapper for every component which uses components from <b>[react-bootstrap](https://react-bootstrap.github.io/)</b>. That's how we can import and use bootstrap components into our own components. Check `app/pages/index.js` as an example for this.


#### • How it works?
Our `css` and `scss` files are essentially transpiled to css-in-js during runtime and loaded or hot loaded into our app by a recipe that I got from [here](https://github.com/zeit/next.js/tree/master/examples/with-global-stylesheet). That's what the `app/.babelrc`, `app/postcss.config.js` and the webpack config inside `app/next.config.js` are for.

#### `app/pages/index.js`.
```jsx
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import Theme from '../components/Theme';

// Straight away require/import scss/css just like in react.
import indexStyle from '../styles/index.scss';

const Index = () => (
    // Wrap your page inside <Theme> HOC to get bootstrap styling.
    // Theme can also be omitted if react-bootstrap components are not used.
    <Theme>
        {
            /*
            Set indexStyling via dangerouslySetInnerHTML.
            This step will make the below classes to work.
            */
        }
        <style dangerouslySetInnerHTML={{ __html: indexStyle }} />

        <span className="heading">React.js | Next.js | Express.js | Bootstrap - SCSS</span>
        <span className="text">with SSR.</span>
        <span className="text">
            <a href="https://github.com/MustansirZia/next-express-bootstrap-boilerplate">
              Github
            </a>
        </span>
        <br />
        <div className="btn">
            <Link href="/profile">
                <Button bsStyle="primary">Click Me</Button>
            </Link>
        </div>

        {/* Styling using styled-jsx. */}
        <style jsx>{`
              .btn {
                display: flex;
                justify-content: center;
              }`
        }
        </style>
    </Theme>
);

export default Index;
```
<br />

## Express integration.

The backend routing is handled primarily inside `app.js`. There is where we initialize our express router. There is only app level middlewares at the moment (with a single route defined - `/main` in place). You can move the routing to a separate root folder like `routes` and use router level middlewares. <br />
It should look quite familiar to the `app.js` of a normal express app with the exception of the asynchronous `next(app)` function call. This bootstraps Next.js with our express server and adds two middlewares to our existing router. <br />
The first middleware adds `req.app` and `req.handle` properties to our `req` object. We can use these to render pages from Next.js inside our express routes. <br />
The second middleware simply makes sure to divert any request comes to a route that is not defined within our express routes to the Next.js' handler which takes care of it automatically by looking up inside `app/pages` for a corresponding component. (This is why a request to `/` and `/profile` is catered to even though it is not defined in the express router; Only `/main` is defined there). <br />
Thus, as you can see requests to `/main` and `/` mean the same thing. Each component is rendered on the server and then sent to the client. <br />
Look inside `app.js` and `next.js` to know more.

#### `app.js`.
```js
const app = require('express')();
// const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const next = require('./next');

// Put in place textbook middlewares for express.
if (process.env.NODE_ENV !== 'production') {
    // app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const start = async (port) => {
    // Couple Next.js with our express server.
    // app and handle from "next" will now be available as req.app and req.handle.
    await next(app);

    // Normal routing, if you need it.
    // Use your SSR logic here.
    // Even if you don't do explicit routing the pages inside app/pages
    // will still get rendered as per their normal route.
    app.get('/main', (req, res) => req.app.render(req, res, '/', {
        routeParam: req.params.routeParam
    }));

    app.listen(port);
};

// Start the express server.
start(9001);
```

<br />

## Goodies.
### Hot loading.  <br />
(For dev environment) <br />

<p>

Hot loading is automatically added for any change inside `app` by Next.js which hot loads components as you change them. (This includes any css scss files)

</p>

<p>

Hot loading for any server side code is handled by `nodemon` which restarts the node server automatically.

</p>

### Linting.  <br />

<p>

Eslint is also added which uses the [airbnb](https://github.com/airbnb/javascript) style guide. Custom rules are defined to suit this very boilerplate inside `package.json` via a key called `eslintConfig`.

</p>

<br />

## Compatibity.
Should be okay with node version >= `7.6`. This is because I've used `async/await`. For older versions I would recommend buidling with babel with the help of a plugin called `transform-runtime`.


## Further reading.
• [Learnnextjs.com.](https://learnnextjs.com/) <br />
• [Next.js blog.](https://zeit.co/blog/next4)


## Contributions.
PRs are quite welcome! :)

## LICENSE.
• [MIT.](https://github.com/MustansirZia/next-express-bootstrap-boilerplate/blob/master/LICENSE)
