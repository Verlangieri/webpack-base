import "./Main.less";
import ReactDOM from "react-dom";
import * as React from "react";
import AppView from "./components/appView/AppView";
import { GlobalConfig } from "./data/GlobalConfig";
import { prepare } from "./helpers/prepare";
import { Router } from "./lib/solidify/navigation/Router";
import { customLog } from "./helpers/customLog";
import configureStore from "./store/index";
import { Provider } from "react-redux";

// prepare
const { log } = prepare("Main");

// ----------------------------------------------------------------------------- INJECT DATA

// Inject params into config
GlobalConfig.instance.inject({
  version: require("../package.json").version,
  base: process.env.BASE_URL,
  env: process.env.ENV
});

// Add log in console
["env", "version", "base"].map(el => {
  customLog(log, `${el}: ${GlobalConfig.instance[el]}`);
});

// ----------------------------------------------------------------------------- ROUTES

// Init router
// Google analytics is automatically called when page is changing

Router.init(GlobalConfig.instance.base, [
  {
    url: "/",
    page: "HomePage",
    // Use require to load synchronously
    importer: () => require("./pages/homePage/index")
    // Use import to load asynchronously
    // importer: () => import("./pages/homePage/HomePage")
  },
  {
    url: "/blog",
    page: "BlogPage",
    importer: () => require("./pages/blogPage/index")
  },
  {
    url: "/article-{#id}-{slug}",
    page: "ArticlePage",
    importer: () => require("./pages/articlePage/index")
  }
]);

// Enable auto link listening
Router.listenLinks();

// ----------------------------------------------------------------------------- START

// React render
ReactDOM.render(
  <Provider store={configureStore()}>
    <AppView />
  </Provider>,
  document.getElementById("AppContainer")
);
