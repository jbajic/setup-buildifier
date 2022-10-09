import * as cache from '@actions/cache';
import * as core from '@actions/core';
import { HTTPError } from '@actions/tool-cache';
import * as installer from './installer';
const cachedir = require('cachedir');

export async function run() {
  try {
    const versionSpec = core.getInput('buildfier-version');
    const token = core.getInput('token');

    const installDir = await installer.getBuildifier(versionSpec, token);
    core.addPath(installDir);
    core.info('Added buildfier to the path');

    // Restore the cache area where bazelisk stores actual Bazel executables.
    const cacheDir: string = cachedir('buildfier');
    await cache.restoreCache([cacheDir], 'buildfier');
    core.info(`Restored buildfier cache dir @ ${cacheDir}`);

    core.info(`Successfully setup buildfier version ${versionSpec}`);
  } catch (e: any) {
      core.setFailed(e.message);
  }
}
