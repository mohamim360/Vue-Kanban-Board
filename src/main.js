import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { clerkPlugin } from "@clerk/vue"; 

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key! Add it to your .env file.");
}

const app = createApp(App);

app.use(clerkPlugin, {
  publishableKey: PUBLISHABLE_KEY,
});

app.mount("#app");
