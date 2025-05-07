FROM node:20-alpine AS development

WORKDIR /user/src/app

COPY package*.json ./
COPY package-lock*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Add default DATABASE_URL (can be overridden at runtime)
ENV DATABASE_URL=mongodb+srv://backendnode:backendnode@backend.ijeqg.mongodb.net/?retryWrites=true&w=majority&appName=backend


WORKDIR /user/src/app

COPY package*.json ./
COPY package-lock*.json ./

RUN npm install --prod

COPY --from=development /user/src/app/dist ./dist

CMD [ "node", "dist/apps/auth/main" ]