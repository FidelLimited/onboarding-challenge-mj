const child = require('child_process');

module.exports.checkEngines = () => {
  const packageJSON = require('./../package.json');

  const versions = {
    node: {
      actual: child.execSync('node -v').toString().trim().substring(1),
      expected: packageJSON.engines.node,
    },
    npm: {
      actual: child.execSync('npm -v').toString().trim(),
      expected: packageJSON.engines.npm,
    },
  };

  const versionsString = JSON.stringify(versions, null, 2);

  if (
    !versions.node.actual.includes(versions.node.expected) ||
    !versions.npm.actual.includes(versions.npm.expected)
  ) {
    console.error('\x1b[31m', 'Engines Versions: MISMATCH', versionsString);
  } else {
    console.log('\x1b[32m', 'Engines Versions: OK', versionsString);
  }
};

module.exports.checkEngines();
