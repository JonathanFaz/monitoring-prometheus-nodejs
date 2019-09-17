### counter
Counter is a monotonically increasing counter. It MUST NOT allow the value to decrease, however it MAY be reset to 0 (such as by server restart).

A counter MUST have the following methods:

* inc(): Increment the counter by 1
* inc(double v): Increment the counter by the given amount. MUST check that v >= 0.
A counter is ENCOURAGED to have:

A way to count exceptions throw/raised in a given piece of code, and optionally only certain types of exceptions.

Counters MUST start at 0.


### Gauge
Gauge represents a value that can go up and down.

A gauge MUST have the following methods:

* inc(): Increment the gauge by 1
* inc(double v): Increment the gauge by the given amount
* dec(): Decrement the gauge by 1
* dec(double v): Decrement the gauge by the given amount
* set(double v): Set the gauge to the given value
* Gauges MUST start at 0, you MAY offer a way for a given gauge to start at a different number.

A gauge SHOULD have the following methods:

set_to_current_time(): Set the gauge to the current unixtime in seconds.
A gauge is ENCOURAGED to have:

A way to track in-progress requests in some piece of code/function. This is track_inprogress in Python.

A way to time a piece of code and set the gauge to its duration in seconds. This is useful for batch jobs. This is startTimer/setDuration in Java and the time() decorator/context manager in Python. This SHOULD match the pattern in Summary/Histogram (though set() rather than observe()).


### Histogram

Histograms track sizes and frequency of events.

**Configuration**

The defaults buckets are intended to cover usual web/rpc requests, this can
however be overriden.

```js
const client = require('prom-client');
new client.Histogram({
  name: 'metric_name',
  help: 'metric_help',
  buckets: [0.1, 5, 15, 50, 100, 500]
});
```

You can include all label names as a property as well.

```js
const client = require('prom-client');
new client.Histogram({
  name: 'metric_name',
  help: 'metric_help',
  labelNames: ['status_code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});
```

Examples

```js
const client = require('prom-client');
const histogram = new client.Histogram({
  name: 'metric_name',
  help: 'metric_help'
});
histogram.observe(10); // Observe value in histogram
```

Utility to observe request durations

```js
const end = histogram.startTimer();
xhrRequest(function(err, res) {
  end(); // Observes the value to xhrRequests duration in seconds
});
```

### Summary

Summaries calculate percentiles of observed values.

**Configuration**

The default percentiles are: 0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999. But they
can be overriden like this:

```js
const client = require('prom-client');
new client.Summary({
  name: 'metric_name',
  help: 'metric_help',
  percentiles: [0.01, 0.1, 0.9, 0.99]
});
```

To enable the sliding window functionality for summaries you need to add
`maxAgeSeconds` and `ageBuckets` to the config like this:

```js
const client = require('prom-client');
new client.Summary({
  name: 'metric_name',
  help: 'metric_help',
  maxAgeSeconds: 600,
  ageBuckets: 5
});
```

The `maxAgeSeconds` will tell how old an bucket can be before it is reset and
`ageBuckets` configures how many buckets we will have in our sliding window for
the summary.

Usage example

```js
const client = require('prom-client');
const summary = new client.Summary({
  name: 'metric_name',
  help: 'metric_help'
});
summary.observe(10);
```

Utility to observe request durations

```js
const end = summary.startTimer();
xhrRequest(function(err, res) {
  end(); // Observes the value to xhrRequests duration in seconds
});
```
