#!/bin/bash
# Builds a release package.

# Extract the version.
VERSION=$(awk '/<em\:version>.*<\/em\:version>/ { 
    start = index($0, ">") + 1
    version = substr($0, start)
    end = index(version, "<")
    version = substr(version, 0, end)
    print version
}' ./src/install.rdf)
#echo $VERSION

# Create the package.
PACKAGE_NAME="tab_wheel_scroll-${VERSION}"
#echo $PACKAGE_NAME
./package.sh $PACKAGE_NAME
mv "${PACKAGE_NAME}.xpi" ./releases

