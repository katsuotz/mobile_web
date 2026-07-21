import React, { useEffect } from 'react'
import { useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { Link } from 'react-router'

const BookmarkPage = () => {
    const apiUrl = "http://127.0.0.1:8000/api/v1"
    const [bookmarks, setBookmarks] = useState([])
    const [recommendationNews, setRecommendationNews] = useState([])
    const [bookmark, setBookmark] = useState(() => {
        const bookmarked = localStorage.getItem('bookmarked')
        return bookmarked ? JSON.parse(bookmarked) : []
    })

    const getNews = async () => {
        try {
            const res = await axios.get(`${apiUrl}/posts`)
            setBookmarks(res.data.data.items.filter(c => bookmark.includes(c.id)))
            console.log(res.data.data.items);
        } catch (err) {
            console.log(err);
        }
    }


    useEffect(() => {
        getNews()
    }, [apiUrl])

    const handleAddBookmark = (id) => {
        setBookmark(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
        getNews()
    }

    useEffect(() => {
        if (Array.isArray(bookmark)) {
            localStorage.setItem("bookmarked", JSON.stringify(bookmark))
        }
    }, [bookmark])

    return (
        <>
            <Header title="Bookmark"></Header>

            <div className="main-container">
                {bookmarks && bookmarks.length > 0 ? bookmarks.map(news => (
                    <div className="recommendation-item">
                        <Link to={`/posts/${news.slug}`}>
                            <img src={news.thumbnail} alt={news.title} />
                            <h5>{news.title}</h5>
                            <p>{news.category.icon} {news.category.slug}</p>
                        </Link>
                        <button onClick={() => handleAddBookmark(news.id)}>⭐</button>
                    </div>

                )) : (
                    <p>No Bookmark News</p>
                )}
            </div>
        </>
    )
}

export default BookmarkPage