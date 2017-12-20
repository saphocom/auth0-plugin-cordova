import version from "auth0-js/src/version";
import PluginHandler from "./PluginHandler";
import BrowserViewHandler from "./BrowserViewHandler";

export default class Auth0JsPluginCordova {
  constructor() {
    this.webAuth = null;
    this.pluginHandler = null;
    this.version = version.raw;
    this.extensibilityPoints = ["popup.authorize", "popup.getPopupHandler"];
  }

  /**
   * @param {WebAuth} webAuth
   */
  setWebAuth(webAuth) {
    this.webAuth = webAuth;
  }

  /**
   * @returns {boolean}
   */
  supports(extensibilityPoint) {
    return (
      window &&
      (window.cordova || !!window.electron) &&
      this.extensibilityPoints.indexOf(extensibilityPoint) > -1
    );
  }

  /**
   * @returns {PluginHandler}
   */
  init() {
    if (!this.pluginHandler) {
      this.pluginHandler = new PluginHandler(this.webAuth);
    }

    return this.pluginHandler;
  }

  static finishAuth(url) {
    return BrowserViewHandler.finishAuth(url);
  }
}
