require("colors");
const path = require("path");
const Inquirer = require("inquirer");
const changeCase = require("change-case");
const createFile = require("./helpers/create-file");
const { logs } = require("../../helpers/logs-helper");
const { Files } = require("@zouloux/files");
const debug = require("debug")("config:scaffold-component");

// ----------------------–----------------------–----------------------–-------- CONF

// remove Files lib logs
Files.setVerbose(false);

// get local task path
const paths = require("../../global.paths");
// get local task config
const config = require("../../global.config");

// ----------------------–----------------------–----------------------–-------- PRIVATE

const _askWhichBundleFolder = (bundleFolderList) => {
  return Inquirer.prompt({
    type: "list",
    name: "bundleFolder",
    message: "Which bundle folder?",
    choices: bundleFolderList,
  });
};

const _askWhichComponentFolder = (
  componentCompatibleFolders = config.componentCompatibleFolders
) => {
  return Inquirer.prompt({
    type: "list",
    name: "subFolder",
    message: "Which component folder?",
    choices: componentCompatibleFolders,
  });
};

const _askComponentName = () => {
  return Inquirer.prompt({
    type: "input",
    message: "Component name?",
    name: "componentName",
  });
};

const _askConnectToStore = () => {
  return Inquirer.prompt({
    type: "confirm",
    message: "Connect component to store?",
    name: "connectToStore",
    default: false,
  });
};

/**
 * React Component Builder
 * @param subFolder
 * @param connectToStore
 * @param upperComponentName
 * @param componentPath
 * @private
 */
const _reactComponentBuilder = ({
  subFolder,
  connectToStore,
  componentPath,
  upperComponentName,
}) => {
  // choose between page and component type
  const componentType = subFolder === "pages" ? "page" : "component";
  // scaffold component file
  createFile({
    templateFilePath: `${paths.componentsTemplatesPath}/react/${componentType}.tsx.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.tsx`,
    replaceExpressions: { upperComponentName },
  });

  // index type depend of conect to store answer
  const indexType = `index${connectToStore ? "-redux" : ""}`;
  // scaffold index
  createFile({
    templateFilePath: `${paths.componentsTemplatesPath}/react/${indexType}.ts.template`,
    destinationFilePath: `${componentPath}/index.ts`,
    replaceExpressions: { upperComponentName },
  });

  // scaffold less module
  createFile({
    templateFilePath: `${paths.componentsTemplatesPath}/react/component.less.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.module.less`,
    replaceExpressions: { upperComponentName },
  });
};

/**
 * DOM Component builder
 * @param componentPath
 * @param upperComponentName
 * @private
 */
const _domComponentBuilder = ({ componentPath, upperComponentName }) => {
  // scaffold component file
  createFile({
    templateFilePath: `${paths.componentsTemplatesPath}/dom/component.ts.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.ts`,
    replaceExpressions: { upperComponentName },
  });
  // scaffold less module
  createFile({
    templateFilePath: `${paths.componentsTemplatesPath}/dom/component.less.template`,
    destinationFilePath: `${componentPath}/${upperComponentName}.less`,
    replaceExpressions: { upperComponentName },
  });
};

// ----------------------–----------------------–----------------------–-------- PUBLIC

/**
 * @name index
 * @description Ask question and scaffold a component with a specific script template
 * @returns {Promise<any>}
 */
const scaffoldComponent = (pComponentType) => {
  return new Promise(async (resolve) => {
    // prepare

    const bundleFolderList = Files.getFolders(`${paths.src}/*`).files;
    debug("bundleFolderList", bundleFolderList);

    // remove common from bundle list
    const filterBundleFolderList =
      // in bundle list folder
      bundleFolderList
        // do not keep common folder
        .filter((el) => el !== `${paths.src}/common`)
        // keep only end of path
        .map((el) => path.basename(el));

    debug("filterBundleFolderList", filterBundleFolderList);

    /**
     * Ask questions
     */
    let bundleFolder = "";
    // Get bundle folder
    await _askWhichBundleFolder(filterBundleFolderList).then((answer) => {
      bundleFolder = answer.bundleFolder;
    });
    debug("bundleFolder", bundleFolder);

    let subFolder = "";
    // Get sub-folder
    await _askWhichComponentFolder().then((answer) => {
      subFolder = answer.subFolder;
    });
    debug("subFolder", subFolder);

    // Get component name
    let componentName = "";
    await _askComponentName().then((answer) => {
      componentName = answer.componentName;
    });
    // formated name "lowerCase"
    let lowerComponentName = changeCase.camelCase(componentName);
    // formated name "UpperCase"
    let upperComponentName = changeCase.pascalCase(componentName);
    debug("upperComponentName", upperComponentName);

    // Get connect to store response
    let connectToStore = false;
    if (pComponentType === "react") {
      await _askConnectToStore().then((answer) => {
        connectToStore = answer.connectToStore;
      });
      debug("connectToStore", connectToStore);
    }

    // Base path of the component (no extension at the end here)
    let componentPath = `${paths.src}/${bundleFolder}/${subFolder}/${lowerComponentName}`;
    debug("component will be created here: componentPath", componentPath);

    /**
     * Build component
     */
    // build REACT component
    if (pComponentType === "react") {
      _reactComponentBuilder({
        subFolder,
        connectToStore,
        upperComponentName,
        componentPath,
      });
    }

    // build DOM component
    if (pComponentType === "dom") {
      _domComponentBuilder({
        upperComponentName,
        componentPath,
      });
    }

    // final log
    logs.done("Component created.");
    resolve();
  });
};

/**
 * return scaffold component function
 */
module.exports = { scaffoldComponent };
