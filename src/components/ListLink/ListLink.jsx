import React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"

import STYLES from "./ListLink.module.scss"

const ListLink = linkElement => (
  <li className={STYLES.ListLink}>
    <Link to={linkElement.to}>{linkElement.children}</Link>
  </li>
)

ListLink.propTypes = {
  linkElement: PropTypes.shape({
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }),
}

export default ListLink
