# setup-buildifier

GitHub Action for for setting up Bazel's build tool buildifier for checking and
formatting Bazel's files format check on Bazel files using [buildifier](https://github.com/bazelbuild/buildtools) checks. This check does not format
the code but does only the verification.

Buildifier automatically check all the files that carry one of the Bazel's
files:
 - `BUILD`
 - `WORKSPACE`
 - `.bzl`

## Inputs

 - `version` [optional]: The version of used `buildifier`
    - Default: "5.1"
    - Supported version: Check out [release page](https://github.com/bazelbuild/buildtools/releases) of `buildifer`

## Outputs

- `success`: Bool tells if the action has succeeded or failed.

## Example Usage

To use `setup-buildifier` you can follow presented examples to see how it
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

    - name: Setup buildifier
      uses: jbajic/setup-buildifier@1

    - name: Run buildifier
      run: |
        buildifier .
```
