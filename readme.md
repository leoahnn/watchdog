# Load Monitor

## To Run

- `npm install`
- `npm start`
- open [http://127.0.0.1:8080](http://127.0.0.1:8080) in a browser

## Tests

- `npm test`

## Decisions

- JS/Node: Allows first class JSON manipulation and easy access to the DOM. Many established packages for websockets, front-ends, etc...
- Express: Easily serve a static page as well as a websocket
- MetricsGraphics: Displays data & markers in a semi-interactive view. Provides autoformatting of dates & animated updates.
- Bootstrap: Quick formatting

## Future Improvements

- store data in a DB 
  - to enable wider/customizable time spans
  - so past 10 min of data can be served on new connections 
- Add customization for timespan/warnings/refresh, etc... on the client side
- split up monitor into more modules to simplify & make more easily extensible 
- use a more accurate timing scheme & scheduler
- split up view into components
  - one component for graph, one for history of warnings
- clean up graph to prevent overlap of mouseover popup, markers, etc...
- enable CORS on the server
- add more error handling for websocket interruptions/failures
- expand test suite for other functions, end-to-end, and UI
