/// <reference types="svelte" />

import "./styles/style.scss";
import "./components/app.svelte";

await import("lilith-transition");

document.body.innerHTML = "<lilith-app></lilith-app>";
