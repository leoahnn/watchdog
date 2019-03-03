# Load Monitor

## To Run

- `npm install`
- `npm start`
- open [localhost:8080](localhost:8080) in a browser

## Decisions

- JS/Node: allows quick JSON manipulation and easy access to the DOM. Many established packages for websockets, front-ends, etc... 
- Express: to easily serve a static page as well as a websocket
- MetricsGraphics: to display data & markers in a semi-interactive view
- Bootstrap: quick and dirty formatting

## Future Improvements

- store data in a DB 
  - to enable wider/customizable time spans
  - so past 10 min of data can be served on new connections 
- Add customization for timespan/warnings/refresh, etc... on the client side
- split up monitor into more modules to simplify & make more easily extensible 
- split up view into components
  - one component for graph, one for history of warnings
- enable CORS on the server
- add more error handling for websocket interruptions/failures