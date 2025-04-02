FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json .

RUN npm install --only=production
# RUN curl -fsSL https://get.pnpm.io/install.sh | sh -
# ENV PATH="/root/.local/share/pnpm:${PATH}"
# RUN ln -s /root/.local/share/pnpm/pnpm /usr/local/bin/pnpm
COPY . .

EXPOSE 8080

CMD ["pnpm", "envio", "dev"]