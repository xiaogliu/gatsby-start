import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/Layout"
import Image from "../components/image"
import SEO from "../components/seo"

import STYLES from "./blog.module.scss"

const BlogPage = ({ data }) => {
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
          <div key={id} className={STYLES.Blog__postContainer}>
            <Link to={slug}>
              <h3 className={STYLES.Blog__postTitle}>{title}</h3>
              <section className={STYLES.Blog__postMetaData}>
                <p>{date}</p>
                {tags && tags.length > 0 && (
                  <p>
                    {tags.map(tag => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </p>
                )}
              </section>
              <p className={STYLES.Blog__postExcerpt}>{excerpt}</p>
            </Link>
          </div>
        )
      })}
    </Layout>
  )
}

export default BlogPage

export const query = graphql`
  query {
    allMarkdownRemark {
      totalCount
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
