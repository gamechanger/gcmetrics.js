# gcmetrics.js

GameChanger Metrics API. This node module provides an API for logging application metrics to the infrastructure's monitoring platform. 

## How to use
1. Include gcmetrics.js in your app project by adding a line to your package.json file:

    ```javascript
        ...
        "dependencies": {
            "gcmetrics": "git+ssh://git@github.com:gamechanger/gcmetrics.js.git"
        }
        ...
    ```

2. Run `npm install` to install the package into your app's `node_modules`.
3. Add appropriate config for dogstatsd into your application config, e.g.:

    ```javascript
    {
        "dogstatsd": {
            "host": "localhost",
            "port": 8135
        }
    }
    ```

4. Within your app, require `gcmetrics` and use this object to log metrics:

    ```javascript
    var metrics = require('gcmetrics');
    
    metrics.increment('requests');
    ```

5. That's it. 


## Notes

 - Each key logged to the metrics API is automatically prefixed with the enclosing application's name, as declared in the application's `package.json` file. For example, if I call `metrics.increment('requests')` within the "push" application, the actual key logged to DataDog will be `push.requests`.

## TODO:

 - Push/Pop tag context
 - Chained API, e.g.
    ```javascript
    metrics.timed('response').tag('http_code', 404).exec(cb);
    ```

## Development

To install gcmetrics dependencies run `npm install`. 

To run test run `make test`.