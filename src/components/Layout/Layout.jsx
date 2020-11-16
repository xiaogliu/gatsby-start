/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"
import Img from "gatsby-image"

import Header from "../Header"
import ListLink from "../ListLink"

import STYLES from "./Layout.module.scss"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query AvatarQuery {
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
          slogan
        }
      }
    }
  `)

  return (
    <React.Fragment>
      <Header>
        <Link to="/" className={STYLES.Layout__home} >
          <Img style={{width: '40px', height: '40px'}} fixed={data.file.childImageSharp.fixed} />
          <span className={STYLES.Layout__slogan} >{data.site.siteMetadata.slogan}</span>
        </Link>
        <ul className={STYLES.Layout__menu}>
          <ListLink to="/blog">博客</ListLink>
          <ListLink to="/photography/">摄影</ListLink>
          <ListLink to="/cookbook/">菜谱</ListLink>
        </ul>
      </Header>

      <div className={STYLES.Layout__main}>
        <main>{children}</main>
        <footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
      </div>
    </React.Fragment>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
