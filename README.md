# Philips Hue

Hue devices are mostly built by Philips, but many other devices can be connected to a hue hub as well. AFAIK it follows the Zigbee standard.

## Install dependencies

  ```
  npm install
  ```

## Start the server

  `npm start`

## Setting up the service

Go to URL http://localhost:3103

### Pairing with a hue hub

When you have the Hue server up and the page linked above open in your browser, press the "Find bridges"-link.

When you have results, go and click on the button on your hue hub. When the hub is in pairing mode, click the "Create user"-link. If the pairing is successful, your user information and hub information will be saved onto the server in local storage. You can see then in the `/hubdata`-folder.

## REST API

Kotio Hue server REST API works over http with JSON messages

### Endpoint cleanup and explanations on the API coming up later
