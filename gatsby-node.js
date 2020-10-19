/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`)

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    let slug = node.frontmatter.path

    // if there is no path in markdown in markdown file, use date + file name
    if (slug === undefined) {

      // capatible with hexo
      let name = node.frontmatter.e_title;
      if (!name) {
        name = getNode(node.parent).name;
      }

      // TODO: this can be more robust
      const year = node.frontmatter.date.slice(0, 4)
      const month = node.frontmatter.date.slice(5, 7)
      const day = node.frontmatter.date.slice(9, 11)
      slug = `/${year}/${month}/${day}/${name}/`
    }

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/blog-post.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })
}
