# setup-buildifier action

![verify-action.yml](https://github.com/jbajic/setup-buildifier/actions/workflows/verify-action.yml/badge.svg?event=schedule)

GitHub Action for setting up Bazel's build tool buildifier for checking and
formatting Bazel's files format checks on Bazel files using [buildifier](https://github.com/bazelbuild/buildtools)
checks. Works on windows, linux and macOS.

Buildifier automatically checks one of the Bazel's files:
 - `BUILD`
 - `WORKSPACE`
 - `.bzl`

## Inputs


| Name  | Description | Required | Default |
| --- | --- | --- | --- |
| version  | The version of the used `buildifier` | `false`| `6.1.2` |

## Example Usage

To use `setup-buildifier` you can follow presented examples to see how it works:

### Check every file
```yml
name: Bazel files check
on: [push]
jobs:
  formatting-check:
    name: Formatting Bazel files check
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup buildifier
      uses: jbajic/setup-buildifier@v1

    - name: Run buildifier
      run: |
        buildifier -mode check -r .
```

## License

Apache-2.0
