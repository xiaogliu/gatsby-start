import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/Layout"
import Image from "../components/image"
import SEO from "../components/seo"

import STYLES from "./index.module.scss"

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <SEO title="Home" />
      <h1>Hi people</h1>
      <p>Welcome to 小光的 blog</p>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
      {data.allMarkdownRemark.edges.map(({ node }) => {
        const {
          id,
          excerpt,
          fields: { slug },
          frontmatter: { title, date, tags },
        } = node

        return (
          <div key={id} className={STYLES.index__postContainer}>
            <Link to={slug}>
              <h3>{title}</h3>
            </Link>
            <p>{excerpt}</p>
            <section className={STYLES.index__postMetaData}>
              <p className={STYLES["index__postMetaData--category"]}>
                Category
              </p>
              {tags && tags.length > 0 && (
                <p>
                  {tags.map(tag => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </p>
              )}
              <p>{date}</p>
            </section>
          </div>
        )
      })}
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div>
    </Layout>
  )
}

export default IndexPage

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
