import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

import STYLES from "./blog-post.module.scss"

export default ({ data }) => {
  const {
    html,
    frontmatter: { title, tags, date },
  } = data.markdownRemark
  return (
    <Layout>
      <div className={STYLES.BlogPost}>
        <section className={STYLES.BlogPost__metaInfo}>
          <h1>{title}</h1>
          <p className={STYLES.BlogPost__metaInfoDate}>
            <span>{date}</span>
            {tags && tags.length > 0 && (
              <span className={STYLES.BlogPost__metaInfoTag}>
                {tags.map(tag => (
                  <span key={tag}>#{tag}</span>
                ))}
              </span>
            )}
          </p>
        </section>

        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </Layout>
  )
}

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        tags
        title
        date(formatString: "DD MMMM, YYYY")
      }
    }
  }
`
