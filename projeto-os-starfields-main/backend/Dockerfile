# Etapa 1: Usa Maven para build
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Mantém o Maven na imagem final para rodar em modo dev
FROM maven:3.8.5-openjdk-17
WORKDIR /app

# Copia os arquivos do backend
COPY --from=build /app /app
RUN mvn dependency:resolve

EXPOSE 8080
CMD ["mvn", "spring-boot:run"]
