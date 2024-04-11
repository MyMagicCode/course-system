/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/timetable",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
