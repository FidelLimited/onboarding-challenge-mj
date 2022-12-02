const child = require('child_process');
const packageJSON = require('./../package.json');

const commitId =
  process.env.CODEBUILD_RESOLVED_SOURCE_VERSION ||
  child.execSync('git rev-parse HEAD');

module.exports.getVersion = () => `${packageJSON.version}-${commitId}`.trim();
