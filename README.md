# AI-Driven Adaptive Benefit Allocation Platform

## Overview

This project is a backend AI service that helps governments allocate social welfare benefits more efficiently.

The system calculates a **vulnerability score for each citizen** and recommends welfare schemes based on their needs.

It also includes **fraud detection** to identify suspicious claims.

---

## Features

* Vulnerability scoring system
* Fraud detection
* Welfare scheme recommendation
* REST API for accessing predictions

---

## Tech Stack

Backend

* TypeScript
* Node.js (Next.js API routes / Express)

Machine Learning

* TensorFlow.js (or custom ML models)

Data Processing

* Danfo.js (pandas-like)
* Lodash

---

## Example Use Case

1. Citizen data is sent to the API.
2. The system calculates a vulnerability score.
3. Fraud detection checks suspicious patterns.
4. The system recommends suitable welfare schemes.

---

## API Modules

* **Scoring API** – calculates vulnerability score
* **Fraud API** – detects fraudulent claims
* **Schemes API** – recommends welfare schemes


# Project Setup

Follow these steps to run the project locally.

---

## 1. Install Node.js

Install **Node.js 18+** (includes npm).

Verify installation:

```
node --version
npm --version
```

---

## 2. Clone the Repository

```
git clone <repository-url>
cd Technetics-Prj-main
```

---

## 3. Install Dependencies

Install dependencies for the Next.js frontend:

```
cd apps/web
npm install
```

---

## 4. Run the Development Server

```
npm run dev
```

Open your browser:

```
http://localhost:3000
```

---

## 5. Build for Production

```
npm run build
npm run start
```




# Project Folder Structure

```
Technetics-Prj-main/
├ apps/
│ └ web/          
│     ├ public/
│     ├ src/
│     │ └ app/
│     │     ├ layout.tsx
│     │     └ page.tsx
│     ├ package.json
│     ├ tsconfig.json
│     └ next.config.ts
├ README.md
├ Setup.md
└ Folder Structure.md
```

---

## Folder Explanation

### apps/web

Next.js TypeScript frontend.

* `src/app` contains the main application routes.
* `public` holds static assets.
* `package.json` contains scripts and dependencies.

---

### README.md

High-level project overview and documentation.

---

### Setup.md

Local development setup instructions.
