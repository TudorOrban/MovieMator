FROM public.ecr.aws/amazoncorretto/amazoncorretto:21

WORKDIR /app

COPY target/moviemator-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]