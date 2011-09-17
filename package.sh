#!/bin/bash
cd src
zip -r ../$1.xpi * --exclude @../package-excluded.lst
