# ---- Base Node ----
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci && npm cache clean --force

# ---- Build ----
FROM base AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build

# ---- Release Distroless ----
# usage of the Distroless NodeJS image allows to copy application and 
# its dependencies from the build stage to this Distroless image. 
# The result is a lightweight, minimal, and secure image that contains 
# just application itself and what’s necessary to run it.
FROM gcr.io/distroless/nodejs18-debian11
WORKDIR /app
COPY --from=build /app/dist ./dist

USER node
EXPOSE 4000

CMD [ "node", "dist/main.js" ]