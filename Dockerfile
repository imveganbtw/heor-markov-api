#
# Base build
#############################
FROM node:14.15.5-alpine AS base
WORKDIR /usr/src/app
COPY package.json ./

#
# Install dependencies
#############################
FROM base as dependencies 
RUN npm set progress=false && npm config set depth 0
RUN npm install --only=production

#
# Build
#############################
FROM dependencies as build
COPY tsconfig.json ./
COPY ./src/ ./src/
RUN npm install typescript
RUN npm run build

#
# Release
#############################
FROM base as release
COPY --from=build /usr/src/app/dist /usr/src/app/dist
ENTRYPOINT ["npm", "start"]