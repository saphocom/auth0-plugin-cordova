import version from 'auth0-js/src/version';
import BrowserHandler from './BrowserHandler';

export default class Auth0PluginCordova {
  constructor() {
    this.webAuth = null;
    this.version = version.raw;
    this.extensibilityPoints = ['popup.authorize', 'popup.getPopupHandler'];
  }

  /**
   * @param {string} url
   */
  static finishAuth(url) {
    return BrowserHandler.finishAuth(url);
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
      (window.cordova || window.electron) &&
      this.extensibilityPoints.indexOf(extensibilityPoint) > -1
    );
  }

  /**
   * @returns {Auth0PluginCordova}
   */
  init() {
    return this;
  }

  /**
   * @param {Object} params
   * @returns {Object} Modified params
   */
  processParams(params) {
    delete params.owp;
    return params;
  }

  /**
   * @returns {BrowserViewHandler}
   */
  getPopupHandler() {
    return new BrowserHandler(this.webAuth);
  }
}
