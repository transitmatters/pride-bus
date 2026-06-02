# Pride Bus Tracker

A live map that tracks the MBTA Pride bus (#1843) as it travels around the
network during Pride season. A React + Vite frontend renders the map and route;
a Python [Chalice](https://aws.github.io/chalice/) app proxies the MBTA V3 API.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Leaflet, Tailwind CSS
- **Backend:** Python 3.12, AWS Chalice (Lambda + API Gateway)
- **Tooling:** [uv](https://docs.astral.sh/uv/) (Python), npm (Node),
  [Ruff](https://docs.astral.sh/ruff/) (lint + format), ESLint + Prettier,
  [pre-commit](https://pre-commit.com)

## Requirements to develop locally

- **Node 20.x and npm 10+**
  - With [`nvm`](https://github.com/nvm-sh/nvm) installed: `nvm install && nvm use`
  - Verify with `node -v`
- **Python 3.12 via [uv](https://docs.astral.sh/uv/)**
  - Install uv: `curl -LsSf https://astral.sh/uv/install.sh | sh` (or `brew install uv`)
  - Verify with `uv --version`
  - uv installs and manages the pinned Python 3.12 toolchain automatically — you
    do not need to install Python yourself.

## Setup

```sh
nvm use            # select Node 20
npm install        # installs Node deps; `postinstall` runs `uv sync` for Python deps
```

`npm install` runs `uv sync` automatically, which creates the `.venv` and
installs the Python dependencies from `uv.lock`. To install Python deps on their
own, run `uv sync`.

(Optional but recommended) enable the git hooks so linting/formatting run on every commit:

```sh
uv run pre-commit install
```

## Running locally

```sh
npm start
```

This runs the Vite dev server and the Chalice backend (`chalice local`)
concurrently. The backend reads the MBTA API key from the `MBTA_V3_API_KEY`
environment variable.

## Linting and formatting

Python is linted and formatted with **Ruff**; the frontend uses **ESLint** and
**Prettier**.

```sh
npm run lint             # lint frontend + backend
npm run lint-frontend    # ESLint
npm run lint-backend     # Ruff check + Ruff format --check
npm run format-backend   # Ruff autofix + format (writes changes)
```

The same Python checks (plus a `uv.lock` consistency check) run via pre-commit
and in CI.

## Deploying

Deploys happen automatically from `main` via GitHub Actions. To deploy manually
you need the AWS credentials and secrets referenced in `deploy.sh`, then:

```sh
bash deploy.sh
```

This builds the frontend, packages the Chalice backend (exporting
`requirements.txt` from `uv.lock`), deploys the CloudFormation stack, and syncs
the static site to S3 + invalidates CloudFront.

## Support TransitMatters

If you've found this app helpful or interesting, please consider [donating](https://transitmatters.org/donate) to TransitMatters to help support our mission to provide data-driven advocacy for a more reliable, sustainable, and equitable transit system in Metropolitan Boston.
