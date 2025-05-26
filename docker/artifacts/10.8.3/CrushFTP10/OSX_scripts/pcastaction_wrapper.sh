#!/bin/bash
# Usage: size scratchFolder sourceFile destFile

#make our scratch dir
mkdir -p "$2"
#generate the preview icon
pcastaction getposterimage --prb="$1" --input="$3" --output="$2"output.png --time="$5"
#convert it from PNG to JPEG
sips -Z $6 -s format jpeg "$2"output.png --out "$2"output.jpg
#move it to the final location (sips can't handle UTF8 chars, so we have to stage, then move it.)
mv "$2"output.jpg "$4"
#erase our scratch dir
rm -R "$2"
echo PREVIEW_DONE
