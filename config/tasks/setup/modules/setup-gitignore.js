require("colors");
const { Files } = require("@zouloux/files");
const { logs } = require("../../../helpers/logs-helper");
const debug = require("debug")("config:setup-gitignore");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../paths");
// get local task config
const config = require("../config");

// ----------------------------------------------------------------------------- MODULE

/**
 * Manage Gitignore
 * @returns {Promise<unknown>}
 */
const setupGitignore = ({
  configFileName = "install.config.js",
  gitignorePath = paths.gitignore,
  logDoneDelay = config.logDoneDelay,
  fakeMode = config.fakeMode
}) => {
  debug("setupGitignore params:", {
    configFileName,
    gitignorePath
  });

  return new Promise(resolve => {
    logs.start(`Setup .gitignore file...`);
    if (!fakeMode) {
      Files.getFiles(gitignorePath).alter(fileContent => {
        return (
          fileContent
            // remove install.cache, we need to add it into git
            .replace(/config\/install.config.js/, `# config/${configFileName}`)
        );
      });
    } else {
      debug("FakeMode is activated, do nothing.".red);
    }

    logs.done();
    setTimeout(resolve, logDoneDelay);
  });
};

module.exports = { setupGitignore };