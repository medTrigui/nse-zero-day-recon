DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

if test -f "Java/lib/modules.osx"; then
  mv Java/lib/modules.osx Java/lib/modules
fi

chmod +x OSX_scripts/*.sh

if test -f "Java/unlocked"; then
  ulimit -n 8000
  Java/bin/java --add-opens=jdk.management/com.sun.management.internal=ALL-UNNAMED --add-opens=jdk.management/com.sun.management.internal=ALL-UNNAMED -Xmx1024m -jar plugins/lib/CrushFTPJarProxy.jar $1
else
  echo "--------------------------------------------------------------"
  echo "-       We need to unlock java one time for it to run.       -"
  echo "-       sudo xattr -rd com.apple.quarantine Java             -"
  echo "--------------------------------------------------------------"
  sudo xattr -rd com.apple.quarantine Java
  chmod +x Java/bin/*
  chmod +x Java/lib/jspawnhelper
  touch Java/unlocked
  ./CrushFTP.command
fi

