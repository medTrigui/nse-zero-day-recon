# docker/Dockerfile
FROM eclipse-temurin:17-jre
COPY artifacts/10.8.3/CrushFTP10/ /opt/crushftp/
WORKDIR /opt/crushftp
EXPOSE 8080
# Run headless – “-d” = daemon mode
CMD ["java","-jar","CrushFTP.jar","-d"]

