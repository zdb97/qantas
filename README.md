## Available Scripts

In the project directory, you can run:

### `npm install`

install project depedencies and dev-dependencies

### `npm start`

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run lint`

Runs ESLint on all `.js`, `.jsx`, `.ts`, and `.tsx` files in the `src` directory.

### `npm run format`

Formats all JS, TS, JSX, TSX, and SCSS files in the `src` directory using Prettier.

---

## Code Quality

- **Linting:** Uses ESLint with Prettier integration.
- **Formatting:** Uses Prettier for code formatting.

---

## Browser Support

See the `browserslist` field in `package.json` for supported browsers in production and development.

---

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
3. Run tests:
   ```sh
   npm test
   ```
4. Lint code:
   ```sh
   npm run lint
   ```
5. Format code:
   ```sh
   npm run format
   ```

---

## Serving the Production Build

After running `npm run build`, you can serve the contents of the `build` folder locally using a static server.  
One simple way is to use the [serve](https://www.npmjs.com/package/serve) package:

1. Install `serve` globally (if you haven't already):

   ```sh
   npm install -g serve
   ```

2. Serve the production build:
   ```sh
   serve -s build
   ```

This will start a local server and you can view your production build at [http://localhost:3000](http://localhost:3000) (or the port shown

## app workflow

- **Initial Page Load:**
  - On first visit, the app fetches airport data from the API and displays it in the UI.
  - The fetched airport data along with (current) timestamp are cached in `localStorage` and will be used within 24 hours.
  - If the API request fails or returns an HTTP error (`!response.ok`), an error message is displayed to the user.

- **Subsequent Page Loads (within 24 hours):**
  - If cached airport data exists in `localStorage` and less than 24 hours old, the app loads airport data from the cache instead of making a new API request.

- **Cache Expiry (after 24 hours):**
  - If more than 24 hours have passed since the last successful fetch, the app attempts to fetch fresh airport data from the API.
  - If the fetch fails but cached data is still present, the app falls back to displaying the cached data.
  - If both the fetch fails and there is no cached data, an error message is displayed.

- **Invalid Routes:**
  - If a user navigates to an unrecognized URL (e.g. `/abcde`), the app redirects to a custom 404 "Page Not Found" page.

- **Invalid Airport Code:**
  - If a user navigates to an invalid airport code (e.g. `/airport/ZZZ`), the app displays an "Airport Not Found" message.

---

## Considerations / Trade-offs

- **Caching Strategy:**
  - Airport data is assumed to change infrequently, so the app only fetches new data once every 24 hours if airport data exists in `localStorage`.
  - If airport data were to change more frequently, a different strategy could be used (e.g. always fetching in the background and updating the cache even if cached data is present in `localStorage`).

- **Error Handling:**
  - The app provides error messages if the API fetch fails or returns an error, and attempts to use cached data as a fallback when possible.

- **Performance:**
  - If the airport dataset is relatively small (e.g. 100 entries), optimizations like `react-window` for virtualization and an alphabet index for navigation are not necessary.
  - For larger datasets, these optimizations can be enabled to improve performance and user experience.

---
