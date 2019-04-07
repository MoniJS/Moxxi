# Moxxi
A OpenSource FPS build with three.js

# Build Instructions
For now, you'll need to run the webpack-dev-server along side the regular development server.

Run the webpack-dev-server (has hmr) with
```sh
npm run dev-server
```

Run the regular node server with
```sh
npm run start
```

For now, you'll have to run both the webpack-dev-server and the regular node server to get the project working. We can get around this by bundling the "dist" files for the Vue ui thingy and outputing them in `src`. Then, we can pass in some env vars / cli flags to the node server, which determine if we want to serve the bundled "prod" files (that contain the ui) or not. When we're using the webpack-dev-server, we *don't* want the bundle to be served.