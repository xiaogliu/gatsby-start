import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {
  const {
    html,
    frontmatter: { title, tags },
  } = data.markdownRemark
  return (
    <Layout>
      <div>
        <h1>{title}</h1>
        {tags && tags.length > 0 && (
          <section>
            {tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </section>
        )}

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
      }
    }
  }
`
