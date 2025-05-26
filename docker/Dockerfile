FROM eclipse-temurin:17-jre
COPY artifacts/10.8.3/CrushFTP10 /opt/CrushFTP10
WORKDIR /opt/CrushFTP10
EXPOSE 8080
# first boot: create default prefs, then stay daemonised
CMD ["java","-jar","CrushFTP.jar","-i","-d"]
