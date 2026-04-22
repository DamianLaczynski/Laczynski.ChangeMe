# Zobacz https://aka.ms/customizecontainer — Visual Studio (tryb szybki) używa stage „base”.
# Build z root repozytorium:
#   docker build -f src/Laczynski.ChangeMe.Backend/Dockerfile .

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY src/Laczynski.ChangeMe.Backend/ ./src/Laczynski.ChangeMe.Backend/
WORKDIR /src/Laczynski.ChangeMe.Backend/
RUN dotnet restore Laczynski.ChangeMe.Backend.sln
RUN dotnet build src/Laczynski.ChangeMe.Backend.Web/Laczynski.ChangeMe.Backend.Web.csproj -c "$BUILD_CONFIGURATION" -o /app/build --no-restore

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish src/Laczynski.ChangeMe.Backend.Web/Laczynski.ChangeMe.Backend.Web.csproj -c "$BUILD_CONFIGURATION" -o /app/publish /p:UseAppHost=false --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Laczynski.ChangeMe.Backend.Web.dll"]
