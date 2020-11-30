import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"

import STYLES from "./blog-list.module.scss"

const BlogList = ({ data }) => {
  return (
    <Layout>
      <SEO title="Blog" />
      {data.allMarkdownRemark.edges.map(({ node }) => {
        const {
          id,
          excerpt,
          fields: { slug },
          frontmatter: { title, date, tags },
        } = node

        return (
          <div key={id} className={STYLES.BlogList__postContainer}>
            <Link to={slug}>
              <h3 className={STYLES.BlogList__postTitle}>{title}</h3>
              <section className={STYLES.BlogList__postMetaData}>
                <p>{date}</p>
                {tags && tags.length > 0 && (
                  <p>
                    {tags.map(tag => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </p>
                )}
              </section>
              <p className={STYLES.BlogList__postExcerpt}>{excerpt}</p>
            </Link>
          </div>
        )
      })}
    </Layout>
  )
}

export default BlogList

export const blogListQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            tags
          }
          fields {
            slug
          }
          excerpt
        }
      }
    }
  }
`
