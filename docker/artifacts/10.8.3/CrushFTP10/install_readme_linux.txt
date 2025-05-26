Linux Java Install Instructions
---------------------------------
Java is required.  We recommend OpenJDK 21 and above.
https://jdk.java.net/archive/

Extract the Java archive:
tar xvf jdk-*.tar.gz

Change the name of the jdk folder to be "Java": 
mv jdk-21* /var/opt/CrushFTP10/Java

Run the init script:
chmod +x crushftp_init.sh
./crushftp_init.sh install

Create a "crushadmin" user:
./Java/bin/java -jar CrushFTP.jar -a crushadmin password
or
java -jar CrushFTP.jar -a crushadmin password

Now you can login at one of these URLs:

http://servername:8080/
http://servername:9090/
https://servername:443/

---------------------------------
*All* of this is automated in our one example "configure" script.
https://www.crushftp.com/crush10wiki/attach/Linux%20Install/configure.sh

