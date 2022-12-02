/**
 *
 * Updates package.json project name, description and version.
 * Additionally it performs a project wide search and replace from 'service-starter'
 * with the name of the project provided as argument. In the vast majority
 * of the cases the search and replace should update the repositories urls in package.json to
 * the appropriate URL.
 *
 * Renaming happens frequently on onboarding exercises and at less extent in new service creation.
 * The script includes support for the update process of service name, description, repos and version.
 * It's expected to improve the developer experience from the current search and replace experience.
 *
 */

import { promises as fs } from 'fs';

import { glob } from 'glob';

const oldProjectName = 'service-starter';

process.on('unhandledRejection', (error) => {
  // Can be removed in most recents versions of NodeJS
  // since it will exit process with non-zero exit code
  console.log('unhandledRejection', error);
  process.exit(1);
});

const searchAndReplace = (string: string, from: string, to: string) => {
  const regexp = new RegExp(from, 'g');
  return string.replace(regexp, to);
};

const forEachFileOn = (
  dirname: string,
  callback: (filename: string) => void,
) => {
  glob(
    dirname + '/!(node_modules)/**/*.*',
    (err: Error | null, filenames: string[]) => {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      filenames.forEach((file) => callback(file));
    },
  );
};

const updatePackageFile = async (
  newProjectName: string,
  newProjectDescription: string,
) => {
  const fileContent = await fs.readFile('package.json', 'utf8');
  const json = JSON.parse(fileContent);

  json['name'] = newProjectName;
  json['description'] = newProjectDescription;
  json['version'] = '1.0.0';

  await fs.writeFile('package.json', JSON.stringify(json, null, 4), 'utf8');
};

const updateFiles = (newProjectName: string) => {
  forEachFileOn('.', async (filename: string) => {
    const fileContent = await fs.readFile(filename, 'utf8');
    const result = searchAndReplace(
      fileContent,
      oldProjectName,
      newProjectName,
    );

    if (result !== fileContent)
      console.log('Re-writting ', filename, '.');

    await fs.writeFile(filename, result, 'utf8');
  });
};

const main = async () => {
  const args = process.argv.slice(2);
  const newProjectName = args[0];
  const newProjectDescription = args[1];

  if (!newProjectName) {
    throw new Error('missing project name arg');
  }

  if (!newProjectDescription) {
    throw new Error('missing project description arg');
  }

  console.log(
    'Adopting',
    newProjectName,
    'as the the project name with description',
    newProjectDescription,
  );

  updatePackageFile(newProjectName, newProjectDescription);

  updateFiles(newProjectName);
};

main();
