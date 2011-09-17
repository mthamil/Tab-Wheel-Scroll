#!/bin/bash
# Builds a release package.

# Extract the version.
VERSION_LINE=$(awk '/<em\:version>.*<\/em\:version>/ { print $0 }' ./src/install.rdf)
#echo $VERSION_LINE

START=$(expr index "$VERSION_LINE" '>')
VERSION=${VERSION_LINE:START}
#echo $VERSION
END=$(expr index "$VERSION" '<')-1
VERSION=${VERSION:0:END}
#echo $VERSION

PACKAGE_NAME="tab_wheel_scroll-${VERSION}"
#echo $PACKAGE_NAME
./package.sh $PACKAGE_NAME
mv "${PACKAGE_NAME}.xpi" ./releases

