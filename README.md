# Currency Portfolio App UI

A web application for managing and tracking your currency portfolio with real-time price updates and visualizations.

## Key Features

*   **Real-time Portfolio Tracking:** View the current value of your currency holdings.
*   **Live Price Updates:** Currency prices are updated in real-time using WebSockets.
*   **Historical Data Charts:** Visualize currency performance with interactive charts.
*   **Add and Manage Currencies:** Easily add new currencies to your portfolio and manage existing ones.
*   **Responsive Design:** Accessible on various devices, including desktops, tablets, and mobile phones.

## Live Preview

[**View the live application here!**](https://your-deployment-url.com) *(Replace with your actual deployment URL)*

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with Turbopack)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components:** [Radix UI](https://www.radix-ui.com/), [Lucide React (Icons)](https://lucide.dev/)
*   **State Management:** [Zustand](https://zustand.surge.sh/)
*   **Data Fetching & Caching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
*   **Real-time Communication:** [Socket.IO Client](https://socket.io/docs/v4/client-api/)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Charting:** [Recharts](https://recharts.org/)
*   **Linting:** [ESLint](https://eslint.org/)
*   **Formatting:** [Prettier](https://prettier.io/)

## Getting Started

### Prerequisites

*   Node.js (v20 or later recommended)
*   Yarn (or npm/pnpm/bun)

### Installation & Setup

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone https://github.com/huseyinunnlu/currency-portfolio-app-ui.git
    cd currency-portfolio-app-ui
    ```

2.  **Install dependencies:**
    ```bash
    yarn install
    # or
    # npm install
    # or
    # pnpm install
    # or
    # bun install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add any necessary environment variables (e.g., API keys, backend URLs).
    Example:
    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8000
    ```
    *(You'll need to specify the actual variables your application uses)*

### Running the Development Server

Execute one of the following commands:

```bash
yarn dev
# or
npm run dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application. The page auto-updates as you edit files in the `src/` directory.

## Available Scripts

In the `package.json` file, you can find several scripts:

*   `yarn dev`: Starts the development server using Next.js with Turbopack.
*   `yarn build`: Builds the application for production.
*   `yarn start`: Starts a Next.js production server.
*   `yarn lint`: Lints the codebase using ESLint.
*   `yarn format`: Formats the code using Prettier.

## Project Structure

The main application code is located within the `src/` directory:

```
src/
├── app/          # Next.js App Router: Pages, layouts, and route handlers
├── components/   # Reusable UI components (Atoms, Molecules, Organisms)
│   ├── ui/       # Shadcn/ui components
│   └── shared/   # Custom shared components
├── constants/    # Application-wide constants (e.g., API endpoints, config values)
├── hooks/        # Custom React hooks
├── lib/          # Utility functions, helper scripts, third-party library configurations
├── queries/      # TanStack Query query/mutation definitions and hooks
├── store/        # Zustand state management stores
└── styles/       # Global styles, Tailwind CSS base configuration
```

## Learn More (Next.js)

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
