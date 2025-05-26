If you didn't download CrushFTP with Java, you need to download Java first before you can launch CrushFTP.  https://jdk.java.net/archive/
Unzip the latest version, and take the "Home" folder from inside the Contents folder and rename it to "Java".  Place this Java folder in the CrushFTP folder.
(This folder has the subfolders bin, lib, conf, etc.)

Move the CrushFTP folder to your Applications folder.
--------------------------------------------------
Now we need to run CrushFTP.command, and un-quarantine the java application from macOS one time.
--------------------------------------------------
Right clicking on CrushFTP.command and selecting open should get you the Apple bypass popup window also.
--if not--
From a Terminal prompt (Applications, Utilities, Terminal), do the following:

cd /Applications/CrushFTP10/
chmod +x CrushFTP.command
./CrushFTP.command

Enter your OS administrator password when prompted.  Your done.  Now CrushFTP.command and java will work without issue.
--------------------------------------------------
CrushFTP cannot be added to the Mac App Store since its a server product and can’t meet Apple’s guidelines due to how it works as a server product.  The Mac App Store is not geared towards server apps other than Apple’s own apps, which don’t meet their own guidelines.  (But it doesn’t matter since its their app store, and they do as they please.)

We are sorry for this inconvenience.  Its a one time action you must take on a new download.

You may also have to manually grant access to your drives to CrushFTP.  See this Apple Support article on how to grant access.
https://support.apple.com/guide/mac-help/control-access-files-folders-mac-mchld5a35146/mac

--CrushFTP Support
support@crushftp.com
