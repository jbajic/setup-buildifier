#!/bin/bash

# Verify if buildifier is present on the system for macos, windows and linux
#
# USAGE: ./verify_buildifier.sh <buildifier_version>
#

function verify_buildifier {
  BUILDIFIER_OUTPUT=$(buildifier -version | grep 'buildifier version: ')
  if [ $? -ne 0 ]; then
      echo "Buildifier not found!"
      exit 1
  fi
  INSTALLED_BUILDIFIER_VERSION=$(echo $BUILDIFIER_OUTPUT | cut -d ':' -f2)
  if [ $BUILDIFIER_VERSION != $INSTALLED_BUILDIFIER_VERSION ]; then
      echo "Wrong buildifier version found, found $INSTALLED_BUILDIFIER_VERSION, wanted $BUILDIFIER_VERSION."
      exit 2
  fi
  echo "Correct buildifier version found!"
  exit 0
}

BUILDIFIER_VERSION="$1"

if [ -z "$BUILDIFIER_VERSION" ]; then
  echo "Missing first argument buildifier version"
  exit 1
fi

verify_buildifier
