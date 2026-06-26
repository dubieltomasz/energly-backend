# Energly (backend)
This backend is a REST API service responsible for handling business logic, authentication, and data management for the application. It provides secure and scalable endpoints for the frontend, including data processing, and integration with external services.

The system is designed with modular architecture, separating controllers, routes, services, and data access layers to ensure maintainability and scalability.

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=dubieltomasz_energly-backend&metric=bugs)](https://sonarcloud.io/summary/new_code?id=dubieltomasz_energly-backend)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=dubieltomasz_energly-backend&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=dubieltomasz_energly-backend)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=dubieltomasz_energly-backend&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=dubieltomasz_energly-backend)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=dubieltomasz_energly-backend&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=dubieltomasz_energly-backend)
![GitHub last commit](https://img.shields.io/github/last-commit/dubieltomasz/energly-backend)

## Acknowledgements
### Carbon Intensity API
This project uses data from the [Carbon Intensity API](https://carbon-intensity.github.io/api-definitions/?shell#carbon-intensity-api-v2-0-0) for Great Britain developed by National Energy System Operator (NESO).

The API data is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

## Tech Stack
- Node.js – runtime environment for server-side JavaScript
- Express.js – lightweight web framework for building REST APIs
- TypeScript – static typing for better maintainability and fewer runtime errors
- dotenv – environment variable management
- ESLint + Prettier – code quality and formatting

## Installation
1. Clone the repository
```
git clone https://github.com/dubieltomasz/energly-backend.git
cd energly-backend
```
2. Install dependencies
```
npm install
```
3. Configure environment variables using template
```
cp .env.template .env
nvim .env
```
4. Start the service
```
npm run build
npm start
```

## Endpoints
- `GET /status`
- `GET /api/generation-mix`
- `GET /api/optimal-window`

## Links
- Frontend Repository: https://github.com/dubieltomasz/energly-frontend
- Checkout the working app at: https://energly-frontend.onrender.com/
