# Admin Dashboard

This is an Admin Dashboard application designed to manage various operations like user management, product listings, and order tracking. Built using modern web technologies, it leverages the **Refine Framework** along with other popular libraries for enhanced functionality and a seamless development experience.

## Features

- **User Management**: Add, edit, and delete users with role-based access control.
- **Product Management**: Manage product listings, including creating, updating, and deleting products.
- **Order Tracking**: Track and update the status of customer orders in real-time.
- **Analytics Dashboard**: Visualize key metrics and performance indicators through interactive charts and graphs.

## Technologies Used

### **Refine Framework**
[Refine](https://refine.dev) is a powerful React-based framework designed to streamline the development of internal tools, admin dashboards, and content management systems. Key features include:
- **Data Management**: Simplifies CRUD operations and connects to various data sources.
- **Authentication & Authorization**: Built-in solutions for user management and role-based access control.
- **Routing**: Automatic routing with support for multiple views and layouts.

### **React**
[React](https://reactjs.org) is a JavaScript library for building user interfaces with reusable components and efficient rendering through the virtual DOM.

### **Ant Design**
[Ant Design](https://ant.design) is a comprehensive UI library offering a collection of high-quality React components, including forms, buttons, data grids, and charts. It provides:
- **UI Components**: Pre-styled components for rapid development.
- **Charts**: Integrated support for data visualization using `@ant-design/plots`.
- **Icons**: A rich set of icons with `@ant-design/icons`.

### **GraphQL**
[GraphQL](https://graphql.org) is a query language for APIs, enabling flexible and efficient data fetching. This project uses:
- **Apollo Client** for querying data from GraphQL APIs.
- **Subscriptions** via `graphql-ws` for real-time updates.
- **Code Generation** with `graphql-codegen` to generate TypeScript types from GraphQL queries and mutations.

### **Vite**
[Vite](https://vitejs.dev) is a fast build tool for modern web applications, offering:
- **Hot Module Replacement (HMR)**: Real-time updates during development for a seamless coding experience.
- **Fast Builds**: Optimized bundling for production deployment.

### **TypeScript**
[TypeScript](https://www.typescriptlang.org) adds static typing to JavaScript, enhancing code quality and reducing errors by enforcing type checks during development.

### **ESLint & Prettier**
- **[ESLint](https://eslint.org)**: A tool for identifying and fixing issues in JavaScript and TypeScript code.
- **[Prettier](https://prettier.io)**: An opinionated code formatter that ensures consistent code style across the project.

### **React Router**
[React Router](https://reactrouter.com) is a routing library for React, enabling dynamic navigation between different components or pages in the application.

### **Day.js**
[Day.js](https://day.js.org) is a lightweight alternative to Moment.js, used for parsing, validating, manipulating, and formatting dates and times.

### **GraphQL Codegen**
[GraphQL Codegen](https://www.graphql-code-generator.com) generates TypeScript types based on GraphQL queries, ensuring type safety and reducing manual type declarations.

### **Markdown Editor**
[React Markdown Editor](https://uiwjs.github.io/react-md-editor/) (`@uiw/react-md-editor`) is a React-based component for editing Markdown content, providing a rich text editing experience.

## Getting Started

To set up and run this project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Eyadfezex/admin-dashboard.git
   cd admin-dashboard
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Start the development server**:

   ```bash
   pnpm dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To build the application for production deployment:

```bash
pnpm build
```

The optimized and minified files will be generated in the `dist` directory.

## Deployment

This project is configured for deployment using platforms like Vercel. Ensure that the build command is set to `pnpm build` and the output directory is `dist`.

## Contributing

Contributions are welcome! If you have suggestions or encounter issues, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Refine Framework](https://refine.dev)
- [Vercel](https://vercel.com) for deployment
- [Chart.js](https://www.chartjs.org) for data visualization
