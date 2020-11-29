module.exports = {
  siteMetadata: {
    title: `Guang`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `Liu Xiaoguang`,
    blog_name: "Vince",
    slogan: "求知，好奇，审美",
    avatar: `../../components/images/avatar.jpg`,
    home_nav: [
      {
        name: "博客",
        url: "/blog",
        internal_link: true,
        target_blank: false,
      },
      {
        name: "Github",
        url: "https://github.com/xiaogliu",
        internal_link: false,
        target_blank: true,
      },
      {
        name: "掘金",
        url: "https://juejin.im/user/2013961030753048/posts",
        internal_link: false,
        target_blank: true,
      },
      {
        name: "SF",
        url: "https://segmentfault.com/u/xiaoguangliu",
        internal_link: false,
        target_blank: true,
      },
      {
        name: "500px",
        url: "https://500px.com/xiaogliu",
        internal_link: false,
        target_blank: true,
      },
    ],
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `source posts`,
        path: `${__dirname}/src/posts`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
          },
        ],
      },
    },

    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
