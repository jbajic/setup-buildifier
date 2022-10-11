import * as core from "@actions/core";
import * as semver from "semver";
import * as tc from "@actions/tool-cache";
import * as octokit from "@octokit/rest";
import fs from "fs";
import os from "os";

export interface IBuildifierAsset {
  name: string;
  browser_download_url: string;
}

export interface IBuildifierVersion {
  tag_name: string;
  draft: boolean;
  prerelease: boolean;
  assets: IBuildifierAsset[];
}

export async function getBuildifier(
  versionSpec: string,
  token: string
): Promise<string> {
  const toolPath: string = tc.find("buildifier", versionSpec);

  if (toolPath) {
    core.info(`Found in cache @ ${toolPath}`);
    return toolPath;
  }

  core.info(`Attempting to download ${versionSpec}...`);

  const osPlat: string = os.platform();
  let osFileName: string = `buildifier-${osPlat}-amd64`;
  if (osPlat == "win32") {
    osFileName = "buildifier-windows-amd64.exe";
  }

  const info = await findMatch(versionSpec, osFileName, token);
  if (!info) {
    throw new Error(
      `Unable to find Buildifier version '${versionSpec}' for platform ${osPlat}.`
    );
  }
  return await cacheBuildifier(info, osFileName, token);
}

async function cacheBuildifier(
  info: IBuildifierVersion,
  osFileName: string,
  token: string
): Promise<string> {
  const downloadPrefix: string =
    "https://github.com/bazelbuild/buildtools/releases/download";
  const downloadUrl: string = `${downloadPrefix}/${info.tag_name}/${osFileName}`;
  core.info(`Acquiring ${info.tag_name} from ${downloadUrl}`);
  const auth = `token ${token}`;
  const downloadPath: string = await tc.downloadTool(
    downloadUrl,
    undefined,
    auth
  );

  core.info("Adding to the cache ...");
  fs.chmodSync(downloadPath, "755");
  const cachePath: string = await tc.cacheFile(
    downloadPath,
    "buildifier",
    "buildifier",
    info.tag_name
  );
  core.info(`Successfully cached buildifier to ${cachePath}`);
  return cachePath;
}

async function findMatch(
  versionSpec: string,
  osFileName: string,
  token: string
): Promise<IBuildifierVersion | undefined> {
  let versions = new Map<string, IBuildifierVersion>();
  let buildifierVersions = await getVersionsFromDist(token);

  buildifierVersions.forEach((buildifierVersion: IBuildifierVersion) => {
    const hasRelevantAsset: boolean = buildifierVersion.assets.some(
      (asset: IBuildifierAsset) => {
        return asset.name == osFileName;
      }
    );
    if (hasRelevantAsset) {
      const version: semver.SemVer | null = semver.coerce(
        buildifierVersion.tag_name
      );
      if (version) {
        versions.set(version.version, buildifierVersion);
      }
    }
  });

  let version: string = evaluateVersions(
    Array.from(versions.keys()),
    versionSpec
  );
  return versions.get(version);
}

async function getVersionsFromDist(
  token: string
): Promise<IBuildifierVersion[]> {
  const octo = new octokit.Octokit({ auth: token });
  const { data: response } = await octo.repos.listReleases({
    owner: "bazelbuild",
    repo: "buildtools",
  });
  return response || [];
}

function evaluateVersions(versions: string[], versionSpec: string): string {
  let version = "";
  core.debug(`evaluating ${versions.length} versions`);
  versions = versions.sort((a, b) => {
    if (semver.gt(a, b)) {
      return 1;
    }
    return -1;
  });
  for (let i = versions.length - 1; i >= 0; i--) {
    const potential: string = versions[i];
    const satisfied: boolean = semver.satisfies(potential, versionSpec);
    if (satisfied) {
      version = potential;
      break;
    }
  }

  if (version) {
    core.debug(`matched: ${version}`);
  } else {
    core.debug("match not found");
  }

  return version;
}
