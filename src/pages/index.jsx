import React from "react"
import { Link, graphql } from "gatsby"
import Img from "gatsby-image"

import SEO from "../components/seo"

import STYLES from "./index.module.scss"

const IndexPage = ({ data }) => {
  return (
    <div className={STYLES.Index}>
      <SEO title="Blog" />
      <section className={STYLES.Index__authorInfo}>
        <Img fixed={data.file.childImageSharp.fixed} />
        <p className={STYLES.Index__name}>{data.site.siteMetadata.blog_name}</p>
        <p className={STYLES.Index__slogan}>{data.site.siteMetadata.slogan}</p>
      </section>
      <hr />

      <ul className={STYLES.Index__nav}>
        {data.site.siteMetadata.home_nav.map(nav => (
          <li key={nav.url} className={STYLES.Index__navItem}>
            {nav.internal_link ? (
              <Link to={nav.url}>{nav.name}</Link>
            ) : (
              <a
                href={nav.url}
                target={nav.target_blank && "_blank"}
                rel="noopener noreferrer"
              >
                {nav.name}
              </a>
            )}
            <span>|</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default IndexPage

export const query = graphql`
  query {
    file(relativePath: { eq: "avatar.jpg" }) {
      childImageSharp {
        # Specify the image processing specifications right in the query.
        # Makes it trivial to update as your page's design changes.
        fixed(width: 100, height: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }

    site {
      siteMetadata {
        blog_name
        slogan
        home_nav {
          name
          url
          internal_link
          target_blank
        }
      }
    }
  }
`
