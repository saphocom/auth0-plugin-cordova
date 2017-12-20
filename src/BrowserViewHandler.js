let _onCustomSchemaRedirect = null;

/**
 * @param {WebAuth} webAuth
 * @constructor
 */
class BrowserViewHandler {
  constructor(webAuth) {
    this.webAuth = webAuth;
  }

  /**
   * @param {string} url
   * @param {string} relayUrl
   * @param {Object} popOpts
   * @param {Function} cb
   */
  load(url, relayUrl, popOpts, cb) {
    const browser = this._openBrowserSession(url, (error, result) => {
      if (error != null) {
        cb(error);
      }

      if (result.event === "closed") {
        cb(new Error("Browser closed"));
      }
    });

    _onCustomSchemaRedirect = () => {
      browser.hide();

      // it shows up in `authenticated` event handler and can tend to use data here but the only reliable code point to sign-in is custom-schema handler
      cb(null, {}); //finish & close Lock modal
    };
  }

  static finishAuth() {
    //cordova app state not lost? then finish Lock session
    _onCustomSchemaRedirect && _onCustomSchemaRedirect();
  }

  /**
   * @param {string} url
   * @param {Function} cb
   * @returns {SafariViewController} Cordova Plugin
   * @private
   */
  _openBrowserSession(url, cb) {
    const browser = window.SafariViewController;

    const options = {
      hidden: false,
      url
    };

    browser.show(
      options,
      result => {
        cb(null, result);
      },
      message => {
        cb(new Error(message));
      }
    );

    return browser;
  }
}

export default BrowserViewHandler;
