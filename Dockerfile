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
RUN cp -R node_modules prod_node_modules
RUN npm install

#
# Test
#############################
# FROM dependencies as test 
# COPY . .
# COPY jest.config.js ./
# COPY ./src/ ./src/
# COPY ./tests/ ./tests/
# RUN npm run lint && npm run test

#
# Build
#############################
FROM dependencies as build
COPY tsconfig.json ./
COPY ./src/ ./src/
RUN npm run build

#
# Release
#############################
FROM base as release

COPY --from=dependencies /usr/src/app/prod_node_modules /usr/src/app/node_modules
COPY --from=build /usr/src/app/dist /usr/src/app/dist
ENTRYPOINT ["npm", "start"]