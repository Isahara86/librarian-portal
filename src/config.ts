const config = {
  development: { isProduction: false },
  production: { isProduction: true },
}[
  process.env.NODE_ENV
];

export default config;
