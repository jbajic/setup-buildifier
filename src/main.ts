import * as cache from "@actions/cache";
import * as core from "@actions/core";
import * as installer from "./installer";
const cachedir = require("cachedir");

export async function run() {
  try {
    const versionSpec = core.getInput("buildifier-version");
    const token = core.getInput("token");

    const installDir = await installer.getBuildifier(versionSpec, token);
    core.addPath(installDir);
    core.info("Added buildifier to the path");

    const cacheDir: string = cachedir("buildifier");
    await cache.restoreCache([cacheDir], "buildifier");
    core.info(`Restored buildifier cache dir @ ${cacheDir}`);

    core.info(`Successfully setup buildifier version ${versionSpec}`);
  } catch (e: any) {
    core.setFailed(e.message);
  }
}
