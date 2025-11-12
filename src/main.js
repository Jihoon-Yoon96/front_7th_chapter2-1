import App from "./App.js";
import setupCartEventListeners from "./utils/cartEventListeners.js";

const enableMocking = () =>
  import("./mocks/browser.js").then(({ worker }) =>
    worker.start({
      onUnhandledRequest: "bypass",
    }),
  );

// 랜더링 시작
if (import.meta.env.MODE !== "test") {
  enableMocking().then(() => {
    App();
    setupCartEventListeners();
  });
} else {
  App();
  setupCartEventListeners();
}
