import "./app.css";
import App from "./App.svelte";

async function enableMocking() {
  const { worker } = await import("./mocks/browser");
  return worker.start();
}

const app = enableMocking().then(() => {
  return new App({
    target: document.getElementById("app"),
  });
});

export default app;
