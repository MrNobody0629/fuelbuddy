FROM node:22-slim

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the full app source
COPY . .

# Build the Vue.js app
RUN npm run build

# Install a lightweight static server
RUN npm install -g serve

# Expose the port that "serve" will use
EXPOSE 5173

# Use Vite's preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
