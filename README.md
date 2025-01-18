This project was generated from [create.xyz](https://create.xyz/).

It is a [Next.js](https://nextjs.org/) project built on React and TailwindCSS.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the code in `src`. The page auto-updates as you edit the file.

## Working with Expert Data

To search for all JSON files in the data/experts directory, you can use any of these methods:

1. Using the command line:
```bash
# From project root
ls src/data/experts/*.json
# or
find src/data/experts -name "*.json"
```

2. Using Node.js:
```javascript
const fs = require('fs');
const path = require('path');

const expertsDir = path.join(__dirname, 'src/data/experts');
const expertFiles = fs.readdirSync(expertsDir)
                     .filter(file => file.endsWith('.json'));
```

3. Using glob pattern:
```javascript
const glob = require('glob');

// Get all JSON files in experts directory
const expertFiles = glob.sync('src/data/experts/*.json');
```

To learn more, take a look at the following resources:

- [React Documentation](https://react.dev/) - learn about React
- [TailwindCSS Documentation](https://tailwindcss.com/) - learn about TailwindCSS
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.