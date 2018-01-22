let _onCustomSchemaRedirect = null;

/**
 * @param {WebAuth} webAuth
 * @constructor
 */
class BrowserHandler {
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
    _onCustomSchemaRedirect = () => {
      cb(null, {}); //finish & close Lock modal
    };

    if (typeof window.SafariViewController !== 'object') {
      this._openSystemBrowser(url);
      return;
    }

    window.SafariViewController.isAvailable(isAvailable => {
      if (!isAvailable) {
        this._openSystemBrowser(url);
        return;
      }

      const browser = this._openBrowserSession(url, (error, result) => {
        if (error != null) {
          cb(error);
        }

        if (result.event === 'closed') {
          cb(null, {});
        }
      });

      _onCustomSchemaRedirect = () => {
        browser.hide();

        // it shows up in `authenticated` event handler and can tend to use data here but the only reliable code point to sign-in is custom-schema handler
        cb(null, {}); //finish & close Lock modal
      };
    });
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

  /**
   * @param {string} url
   * @private
   */
  _openSystemBrowser(url) {
    window.open(url, '_system');
  }
}

export default BrowserHandler;
