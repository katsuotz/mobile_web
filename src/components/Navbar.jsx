import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
    return (
        <nav>
            <Link to={'/'}>Home</Link>
            <Link to={'/discover'}>Discover</Link>
            <Link to={'/bookmark'}>Bookmark</Link>
            <Link to={'/setting'}>Setting</Link>
        </nav>
    )
}

export default Navbar