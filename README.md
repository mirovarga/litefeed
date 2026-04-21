# LiteFeed

A lightweight feed reader.

**Live Demo: [litefeed.vercel.app](https://litefeed.vercel.app)**

> **Note**: This project is a work in progress and is primarily a learning project to explore modern web technologies.

## Features

- **Multi-source Aggregation**: Currently supports Hacker News, Lobsters, and popular programming-related subreddits.
- **Server-side Fetching**: Sources are fetched and merged on the server for optimal performance and SEO.
- **Dynamic Filtering**: Filter stories by source (Hacker News, Lobsters, or Reddit).
- **Flexible Sorting**: Sort by time (newest/oldest) or by comment count.
- **Pagination**: Efficiently browse through stories with built-in pagination.
- **Responsive Design**: Clean and focused reading experience, built with Tailwind CSS 4.
- **Modern Tooling**: Uses Bun for package management and script execution, Biome for linting/formatting (via
  Ultracite).

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [Base UI](https://base-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Linting & Formatting**: [Biome](https://biomejs.dev/) (orchestrated
  by [Ultracite](https://github.com/vladimiroff/ultracite))

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mirovarga/litefeed.git
   cd litefeed
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Run the development server:
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `bun dev`: Starts the development server.
- `bun build`: Builds the application for production.
- `bun start`: Starts the production server.
- `bun lint`: Runs linting checks using Ultracite/Biome.
- `bun format`: Automatically fixes formatting issues.

## License

This project is licensed under the [MIT License](LICENSE).
