import urljoin from "url-join";

class PopupHandler {
  constructor(webAuth) {
    this.webAuth = webAuth;
    this.options = null;
    this._currentPopup = null;
  }

  preload(options) {
    const _this = this;

    const url = options.url || "about:blank";
    const popupOptions = options.popupOptions || {};

    popupOptions.location = "yes";
    delete popupOptions.width;
    delete popupOptions.height;

    const windowFeatures = Object.keys(popupOptions)
      .map(key => `${key}=${popupOptions[key]}`)
      .join(",");

    if (this._currentPopup && !this._currentPopup.closed) {
      return this._currentPopup;
    }

    this._currentPopup = window.open(url, "_blank", windowFeatures);

    this._currentPopup.kill = function(success) {
      _this._currentPopup.success = success;
      this.close();
      _this._currentPopup = null;
    };

    return this._currentPopup;
  }

  load(url, _, options, cb) {
    const _this = this;
    this.url = url;
    this.options = options;
    if (!this._currentPopup) {
      options.url = url;
      this.preload(options);
    } else {
      this._currentPopup.location.href = url;
    }

    this.transientErrorHandler = event => {
      _this.errorHandler(event, cb);
    };

    this.transientStartHandler = event => {
      _this.startHandler(event, cb);
    };

    this.transientExitHandler = () => {
      _this.exitHandler(cb);
    };

    this._currentPopup.addEventListener(
      "loaderror",
      this.transientErrorHandler
    );
    this._currentPopup.addEventListener(
      "loadstart",
      this.transientStartHandler
    );
    this._currentPopup.addEventListener("exit", this.transientExitHandler);
  }

  errorHandler(event, cb) {
    if (!this._currentPopup) {
      return;
    }

    this._currentPopup.kill(true);

    cb({ error: "window_error", errorDescription: event.message });
  }

  unhook() {
    this._currentPopup.removeEventListener(
      "loaderror",
      this.transientErrorHandler
    );
    this._currentPopup.removeEventListener(
      "loadstart",
      this.transientStartHandler
    );
    this._currentPopup.removeEventListener("exit", this.transientExitHandler);
  }

  exitHandler(cb) {
    if (!this._currentPopup) {
      return;
    }

    // when the modal is closed, this event is called which ends up removing the
    // event listeners. If you move this before closing the modal, it will add ~1 sec
    // delay between the user being redirected to the callback and the popup gets closed.
    this.unhook();

    if (!this._currentPopup.success) {
      cb({ error: "window_closed", errorDescription: "Browser window closed" });
    }
  }

  startHandler(event, cb) {
    const _this = this;

    if (!this._currentPopup) {
      return;
    }

    const callbackUrl = urljoin(
      "https:",
      this.webAuth.baseOptions.domain,
      "/mobile"
    );

    if (event.url && !(event.url.indexOf(`${callbackUrl}#`) === 0)) {
      return;
    }

    const parts = event.url.split("#");

    if (parts.length === 1) {
      return;
    }

    const opts = { hash: parts.pop(), _idTokenVerification: false };

    if (this.options.nonce) {
      opts.nonce = this.options.nonce;
    }

    this.webAuth.parseHash(opts, (error, result) => {
      if (error || result) {
        _this._currentPopup.kill(true);
        cb(error, result);
      }
    });
  }
}

export default PopupHandler;
