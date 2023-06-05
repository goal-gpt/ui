# eras UI

Welcome to the **eras** UI repository!

## What is **eras**?
**eras** is a company providing personal finance companionship for individuals all around the world. We hope to serve the various needs of individiuals in their financial journey, no matter what their financial situation is.

## Setup
1. Clone the repository
```bash
git clone git://github.com/eras-fyi/ui.git
```

2. Install dependencies
```bash
npm install
```

3. Add the right env vars
- Create a copy of `.env.local.example` as `.env.local`
- Fill in the values for the env vars in `.env.local`
- Note that `NEXT_PUBLIC_API_ENV` can be set to `mock`, `local` or `prod`:
  - Using `mock`, a JSON response from `__tests__/__mocks__/functions.json` is returned for each message sent.
  - Using `local`, a request is made to a locally deployed edge function served at `http://localhost:50321`.
  - Using `prod`, the request is made to the edge function deployed in production.

4. Run the application
```bash
npm run dev
```

5. Open the application in your browser (http://localhost:3000)
