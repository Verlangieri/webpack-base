const { logs } = require("../../../helpers/logs-helper");
const scaffoldBundle = require("../../scaffold/modules/scaffold-bundle");
const debug = require("debug")("config:setup-bundle");

// ----------------------------------------------------------------------------- PATHS / CONFIG

// target local path files
const paths = require("../paths");
// get local task config
const config = require("../config");

// ----------------------------------------------------------------------------- MODULE

/**
 * Setup Bundle
 * @returns {Promise<unknown>}
 */
const setupBundle = async ({ logDoneDelay = config.logDoneDelay }) => {
  return new Promise(async resolve => {
    logs.start("Setup bundle project type...", true);
    const bundleType = await scaffoldBundle(true);
    logs.done();
    setTimeout(() => resolve(bundleType), logDoneDelay);
  });
};

module.exports = { setupBundle };
