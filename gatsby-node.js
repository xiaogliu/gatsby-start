/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`)
const _ = require("lodash")

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    let slug = node.frontmatter.path

    // if there is no path in markdown in markdown file, use date + file name
    if (slug === undefined) {
      // capatible with hexo
      let name = node.frontmatter.e_title
      if (!name) {
        name = getNode(node.parent).name
      }

      // TODO: this can be more robust
      const year = node.frontmatter.date.slice(0, 4)
      const month = node.frontmatter.date.slice(5, 7)
      const day = node.frontmatter.date.slice(8, 10)
      slug = `/${year}/${month}/${day}/${name}/`
    }

    createNodeField({
      node,
      name: "slug",
      value: slug,
    })
  }
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const blogPostTemplate = path.resolve("src/templates/blog-post.js")
  const tagTemplate = path.resolve("src/templates/tags.js")
  const blogList = path.resolve("src/templates/blog-list.js")
  const result = await graphql(`
    {
      postsRemark: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
        }
      }
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
        }
      }
      blogListData: allMarkdownRemark(
        sort: { fields: [frontmatter___date], order: DESC }
        limit: 1000
      ) {
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
  // handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  const posts = result.data.postsRemark.edges
  // Create post detail pages, node will pass to template page
  posts.forEach(({ node }) => {
    createPage({
      path: node.fields.slug,
      component: blogPostTemplate,
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        slug: node.fields.slug,
      },
    })
  })
  // Extract tag data from query
  const tags = result.data.tagsGroup.group
  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag.fieldValue)}/`,
      component: tagTemplate,
      context: {
        tag: tag.fieldValue,
      },
    })
  })

  // Create blog-list pages with pagination
  const list = result.data.blogListData.edges
  const listPerPage = 6
  const numPages = Math.ceil(list.length / listPerPage)
  Array.from({
    length: numPages,
  }).forEach((e, i) => {
    createPage({
      // it create route when create page 
      path: i === 0 ? `/blog` : `/blog/${i}`,
      component: blogList,
      context: {
        limit: listPerPage,
        skip: i * listPerPage,
        numPages,
        currentPage: i,
      },
    })
  })
}
