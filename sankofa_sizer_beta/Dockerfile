# Use an official Node runtime as the parent image
FROM node:18

# Set the working directory in the container to /app
WORKDIR /app

# Install T3 stack dependencies
RUN npm install next next-auth prisma tailwindcss @trpc/server @trpc/react

# Map the ui directory
VOLUME [ "/app" ]

CMD ["npm", "run", "dev"]

# to use:
# docker build -t ui_sankofa_sizer . && docker run -it --rm -p 3000:3000 --name sankofa-sizer -v $(pwd)/ui:/app ui_sankofa_sizer