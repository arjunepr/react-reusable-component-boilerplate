const fs = require('fs');
const path = require('path');

const { resolve } = path;
const { lstatSync, readdirSync } = fs;

const isDirectory = itemPath => lstatSync(itemPath).isDirectory();
const getDirectoryContents = directoryToSearch => readdirSync(directoryToSearch).map(name => resolve(directoryToSearch, name));

function generateEntryPaths(libraryFolders=['components'], directItems={}) {
  const libPath = resolve(__dirname, '..', 'src', 'lib');
  let entryFilePaths = {};
  libraryFolders.forEach((libraryFolder) => {
    const pathToFolder = resolve(libPath, libraryFolder);
    // console.log({ pathToFolder });
    const entryDirectories = getDirectoryContents(pathToFolder).filter(isDirectory);
    // console.log({ entryDirectories });
    entryDirectories.forEach((item) => {
      // console.log({ item });
      // readdirSync(item).map(item => )
      const currentDirectoryName = item.split(path.sep)[item.split(path.sep).length - 1];
      const filesOfEntryDirectory = getDirectoryContents(item);
      // console.log({ filesOfEntryDirectory });
      for(let currentFile of filesOfEntryDirectory) {
        const currentFileName = currentFile.split(path.sep)[currentFile.split(path.sep).length - 1];
        // console.log({ currentFile, currentFileName });
        const indexRegex = /^index\.(js|ts)x?/;
        const currentFileIsIndexType = indexRegex.test(currentFileName);
        if (currentFileIsIndexType) {
          // entryFilePaths.push({ [currentDirectoryName]: currentFile });
          entryFilePaths[currentDirectoryName] = currentFile;
          break;
        }
      }
    });
  });
  entryFilePaths = { ...entryFilePaths, ...directItems };
  return entryFilePaths;
}

function generateOutputNameJS(containingFolder, chunkData, directItems={}) {
  // console.log({
  //   chunkData,
  //   // 'chunkData.chunk._modules': chunkData.chunk._modules,
  //   // 'chunkData.chunk.entryModule.dependencies': chunkData.chunk.entryModule.dependencies,
  //   // 'chunkData.chunk._modules': chunkData.chunk._modules, chunkData,
  // });
  // return '[name].js';
  // if (directItems.indexOf(chunkData.chunk.name) !== -1) {
  //   return '[name].js';
  // }
  // console.log({ chunkData, directItems });
  if (directItems[chunkData.chunk.name]) {
    // console.log({ 'name': chunkData.chunk.name });
    return '[name].js';
  }
  return `${containingFolder}/[name].js`;
  // const modulePath = chunkData.chunk.entryModule._identifier.split(' ')[-1];
  // const moduleFile = modulePath.split(path.set)[-1];
  // const moduleFolder = modulePath.split(path.sep)[-2];
  // const moduleFilename = moduleFile.split('.')[0];
  // if (directItems.indexOf(moduleFilename) !== -1) {
  //   return `${moduleFilename}.js`;
  // }
  // return `${containingFolder}/${moduleFolder}.js`;
}

function getImportingModulePath(chunkData) {
  const { entryModule: { _identifier, request } } = chunkData;
  if (_identifier) {
    return _identifier.split(' ')[0];
  } else {
    return request;
  }
}

function generateOutputNameCSS(containingFolder, chunkData, directItems={}) {
  const pathOfImportingModule = getImportingModulePath(chunkData);
  const importingModulePathSplit = pathOfImportingModule.split(path.sep);
  const importingModulePathSplitLength = importingModulePathSplit.length;
  const importingFileName = importingModulePathSplit[importingModulePathSplitLength - 1].split('.')[0];
  // console.log({ 'chunkData.entryModule._identifier': chunkData.entryModule._identifier, chunkData, pathOfImportingModule, importingFileName });
  // if (directItems.indexOf(importingFileName) !== -1) {
  //   return `${importingFileName}.css`;
  // }
  // if (directItems.indexOf(pathOfImportingModule) !== -1) {
  //   return `${importingFileName}.css`;
  // }
  // if ()
  if (directItems[importingFileName]) {
    return `${importingFileName}.css`;
  }
  if (importingFileName === 'index') {
    const moduleFolder = importingModulePathSplit[importingModulePathSplitLength - 2];
    return `${containingFolder}/${moduleFolder}.css`;
  }
  return `${containingFolder}/${importingFileName}.css`;
}

module.exports = {
  generateEntryPaths,
  generateOutputNameJS,
  generateOutputNameCSS,
};
