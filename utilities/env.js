// Note: Declared ENV variables must start with "NEXT_PUBLIC_" to work in the browser
// More Information: https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
const env = {
  websocket: process.env.NEXT_PUBLIC_WEBSOCKET,
  server: process.env.NEXT_PUBLIC_SERVER,
}

export default env;