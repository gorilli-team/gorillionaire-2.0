FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
ENV CI=true

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install 

# Copy code
COPY . .

# Regenerate types/code
RUN rm -rf generated && npm run codegen && npm run build

# Install deps and build generated module
EXPOSE 8080

CMD ["npm", "run", "start:envio"]