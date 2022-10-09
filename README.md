# buildifier-action

GitHub Action for for running format check on Bazel files using [buildifier](https://github.com/bazelbuild/buildtools) checks. This check does not format
the code but does only the verification.

Buildifeer automatically check all the files that carry one of the Bazel's
files:
 - `BUILD`
 - `WORKSPACE`
 - `.bzl`

## Version supported

If not specified the action will use the newest `buildifer` available on the
release pages.

## Inputs

 - `version` [optional] => The version of used `buildifier`
    - Default: "5.1"
    - Supported version: Check out [release page](https://github.com/bazelbuild/buildtools/releases) of `buildifer`
 - `path` [optional] => The path to directory that should be checked
    - Default: "."
 - `exclude` [optional] => A regex to exclude files or directors from
    verification
   - Default: "$^"

## Outputs

## Example Usage

To use `buildifier-action` you can follow presented examples to see how it
works:

### Check every file
```yml
name: Bazel files check
on: [push]
jobs:
  formatting-check:
    name: Formatting Check
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run buildifier style check for Bazel's files.
      uses: jbajic/buildifier-action@1
```

### Check all files in src directory with 5.0 `buildfier` version
```yml
name: Bazel files check
on: [push]
jobs:
  formatting-check:
    name: Formatting Check
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Run buildifier style check for Bazel's files.
      uses: jbajic/buildifier-action@1
      version: 5.0
      path: src
```
