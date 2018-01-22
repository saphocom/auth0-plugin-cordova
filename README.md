# auth0-js-plugin-cordova

Adds support for authentication in Cordova using plugins [SafariViewController](https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller) & [Custom URL scheme](https://github.com/EddyVerbruggen/Custom-URL-scheme). 

Plugged in native browser (Chrome Custom Tab / Safari View Controller) instead of WebView allows you to use security providers that doesn't allow login in WebView for security reasons (like Google login) and gives your users a better UX experience (shared cookies with default browser, better navigation controls, etc.)

## Installation
1. Have [SafariViewController](https://github.com/EddyVerbruggen/cordova-plugin-safariviewcontroller) & [Custom URL scheme](https://github.com/EddyVerbruggen/Custom-URL-scheme) Cordova plugins installed in your Cordova project
1. `yarn install @saphocom/auth0-plugin-cordova` or `npm install @saphocom/auth0-plugin-cordova`


## Usage 
```javascript
import Auth0PluginCordova from '@saphocom/auth0-plugin-cordova';

var lock = new Auth0Lock(clientId, domain, {
    auth: {
        redirect: true, // Automatically FALSE in Cordova
        redirectUrl: "myapp://auth0/login",
        responseType: 'code',
    },
    plugins: [new Auth0PluginCordova()],
});

lock.show();

// ...

// Register cordova-plugin-customurlscheme handler 
function handleOpenURL(url) {
    if (url.startsWith("myapp://auth0/login")) {
        Auth0PluginCordova.finishAuth();
    }
}
```
