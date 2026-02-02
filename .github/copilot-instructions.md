# Copilot Instructions for Life Dashboard

## Project Overview
This is a Node.js/Express web application for personal life management, with a focus on finance tracking. The architecture is simple and modular:
- **app.js**: Main entry point. Sets up Express, middleware, routes, and view engine.
- **routes/**: Contains route modules (e.g., `finance.js`) for different dashboard features.
- **db.js**: Handles database connection and queries. (Check for custom logic or connection patterns.)
- **views/**: EJS templates for rendering pages (e.g., `index.ejs`).
- **public/**: Static assets (e.g., `style.css`).

## Key Patterns & Conventions
- **Routing**: All feature routes are defined in `routes/` and mounted in `app.js`. Follow this pattern for new features.
- **Views**: Use EJS templates in `views/`. Pass data from routes to views using Express's `res.render()`.
- **Static Files**: Serve CSS/JS from `public/` using Express's static middleware.
- **Database Access**: Centralized in `db.js`. Reuse connection logic; avoid direct DB calls in route files.
- **Modularity**: Add new dashboard features by creating a route module and corresponding view.

## Developer Workflows
- **Start App**: Run `node app.js` or use `npm start` if defined in `package.json`.
- **Dependencies**: Managed via `package.json`. Use `npm install` for setup.
- **Debugging**: Use `console.log` for quick inspection. For advanced debugging, run with `node --inspect app.js`.
- **Styling**: Edit `public/style.css` for global styles.

## Integration Points
- **External Libraries**: Check `package.json` for dependencies (e.g., Express, EJS).
- **Database**: Likely uses SQLite, MongoDB, or similar (see `db.js`).
- **Cross-Component Communication**: Data flows from route handlers to views via Express's render mechanism.

## Examples
- To add a new dashboard section:
  1. Create `routes/<feature>.js` with Express router.
  2. Add a view template in `views/<feature>.ejs`.
  3. Mount the route in `app.js`.
- To update styles, edit `public/style.css`.

## References
- [app.js](../app.js): Main app setup and route mounting
- [routes/finance.js](../routes/finance.js): Example route module
- [views/index.ejs](../views/index.ejs): Main dashboard view
- [db.js](../db.js): Database logic
- [public/style.css](../public/style.css): Stylesheet

---
_If any conventions or workflows are unclear, please provide feedback to improve these instructions._
