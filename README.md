# IMT Dashboard

## Description

This is a dashboard that allow student to view their grades and planning.

**Key features:**

- View grades
- View planning (weekly)

## Installation (locally)

```bash
git clone https://github.com/IMT-Dashboard/imt-dashboard.git
cd imt-dashboard
npm install
npm run dev
```

## Run tests

```bash
npm run test
```

## Pipeline

This project is using GitHub Actions for CI/CD.

When pushing using a `tag`, the pipeline will deploy an image of the app to the Docker Hub.

**Required secrets:**
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `JWT_SECRET`
- `SALT_PASSWORD`
- `KEY_PASSWORD`

