FROM microsoft/aspnetcore-build:2.0 AS base
WORKDIR /app
RUN npm install n -g
RUN n 8.11
EXPOSE 4100

FROM microsoft/aspnetcore-build:2.0 AS build
WORKDIR /src
RUN npm install n -g
RUN n 8.11
COPY AscendUI.sln ./
COPY AscendPortal/AscendPortal.csproj AscendPortal/
RUN dotnet restore -nowarn:msb3202,nu1503
COPY . .
WORKDIR /src/AscendPortal
RUN dotnet build -c Release -o /app

FROM build AS publish
RUN npm install n -g
RUN n 8.11
RUN dotnet publish -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "AscendPortal.dll"]
