#!/bin/bash
# Usage: size scratchFolder sourceFile destFile

#make our scratch dir
mkdir -p "$2"
#generate the preview icon
# if this is already in our preview directory, then just use sips to make a smaller version
case $3 in
     */p*/3.jpg)
		echo sips 3.jpg
     	sips -Z $1 -s format jpeg "$3" --out "$2"output.jpg
     	if [ -f "$2"*.jpg ]
     	then
     		echo sips worked
     	else
     		echo sips 3.jpg failed, doing alternate method
	     	sips -s format jpeg "$3" --out "$2"output.jpg
	     fi
     	;;
     */p*/2.jpg)
		echo sips 2.jpg
     	sips -Z $1 -s format jpeg "$3" --out "$2"output.jpg
     	if [ -f "$2"*.jpg ]
     	then
     		echo sips 2.jpg worked
     	else
     		echo sips 2.jpg failed, doing alternate method
	     	sips -s format jpeg "$3" --out "$2"output.jpg
	     fi
	     ;;
     *)
	     #otherwise, use qlmanage to make a thumbnail
		qlmanage -t "$3" -s $1 -o "$2"
     	if [ -f "$2"*.png ]
     	then
			#convert it from PNG to JPEG
			sips -s format jpeg "$2"*.png --out "$2"output.jpg
	     else
	     	#file conversion failed, so make one using sips
     		echo qlmanage failed, trying sips method, file might be too small
	     	sips -s format jpeg "$3" --out "$2"output.jpg
	     fi
		;;
esac

#move it to the final location (sips can't handle UTF8 chars, so we have to stage, then move it.)
mv "$2"output.jpg "$4"
#erase our scratch dir
rm -R "$2"
echo PREVIEW_DONE
