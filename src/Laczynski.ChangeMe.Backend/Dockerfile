# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy csproj files
COPY ["src/Laczynski.ChangeMe.Backend/Laczynski.ChangeMe.Backend.sln", "./"]
COPY ["src/Laczynski.ChangeMe.Backend/src/Laczynski.ChangeMe.Backend.API/Laczynski.ChangeMe.Backend.API.csproj", "src/Laczynski.ChangeMe.Backend.API/"]
COPY ["src/Laczynski.ChangeMe.Backend/src/Laczynski.ChangeMe.Backend.Shared/Laczynski.ChangeMe.Backend.Shared.csproj", "src/Laczynski.ChangeMe.Backend.Shared/"]
COPY ["src/Laczynski.ChangeMe.Backend/src/Laczynski.ChangeMe.Backend.Core/Laczynski.ChangeMe.Backend.Core.csproj", "src/Laczynski.ChangeMe.Backend.Core/"]
COPY ["src/Laczynski.ChangeMe.Backend/src/Laczynski.ChangeMe.Backend.Infrastructure/Laczynski.ChangeMe.Backend.Infrastructure.csproj", "src/Laczynski.ChangeMe.Backend.Infrastructure/"]
COPY ["src/Laczynski.ChangeMe.Backend/src/Laczynski.ChangeMe.Backend.UseCases/Laczynski.ChangeMe.Backend.UseCases.csproj", "src/Laczynski.ChangeMe.Backend.UseCases/"]
COPY ["src/Laczynski.ChangeMe.Backend/src/Laczynski.ChangeMe.Backend.Web/Laczynski.ChangeMe.Backend.Web.csproj", "src/Laczynski.ChangeMe.Backend.Web/"]
COPY ["src/Laczynski.ChangeMe.Backend/Directory.Build.props", "./"]
COPY ["src/Laczynski.ChangeMe.Backend/Directory.Packages.props", "./"]
COPY ["src/Laczynski.ChangeMe.Backend/nuget.config", "./"]
COPY ["src/Laczynski.ChangeMe.Backend/global.json", "./"]

# Restore packages
RUN dotnet restore "Laczynski.ChangeMe.Backend.sln"

# Copy everything else
COPY ["src/Laczynski.ChangeMe.Backend/src/", "./src/"]

# Build the application
RUN dotnet build "src/Laczynski.ChangeMe.Backend.Web/Laczynski.ChangeMe.Backend.Web.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "src/Laczynski.ChangeMe.Backend.Web/Laczynski.ChangeMe.Backend.Web.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 5000

# Start the application
ENTRYPOINT ["dotnet", "Laczynski.ChangeMe.Backend.Web.dll"] 