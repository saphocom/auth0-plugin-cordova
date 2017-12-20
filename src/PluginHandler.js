import urljoin from "url-join";
import PopupHandler from "./PopupHandler";
import BrowserViewHandler from "./BrowserViewHandler";

class PluginHandler {
  /**
   * @param {WebAuth} webAuth
   */
  constructor(webAuth) {
    this.webAuth = webAuth;
  }

  /**
   * @param {Object} params
   * @returns {Object} Modified params
   */
  processParams(params) {
    this.params = params;

    if (!this._canUseBrowserView()) {
      console.log(
        "Auth0 needs safariviewcontroller and customurlscheme plugins to work correctly in Cordova environment. ",
        "Falling back to legacy mode.."
      );
      params.redirectUri = urljoin(`https://${params.domain}`, "mobile");
    }

    delete params.owp;
    return params;
  }

  getPopupHandler() {
    if (!this.params || !this._canUseBrowserView()) {
      return new PopupHandler(this.webAuth);
    }

    return new BrowserViewHandler(this.webAuth);
  }

  /**
   * Whether Browser View (SafariViewController / ChromeCustomTabs) is available in current constellation
   *
   * @returns {boolean}
   * @private
   */
  _canUseBrowserView() {
    return (
      typeof window === "object" &&
      typeof window.SafariViewController === "object"
    );
  }
}

export default PluginHandler;
