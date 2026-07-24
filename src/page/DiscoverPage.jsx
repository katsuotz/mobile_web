import React, { useEffect, useRef, useState, useCallback } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { Link } from 'react-router'

const DiscoverPage = () => {
    const apiUrl = "http://127.0.0.1:8000/api/v1"
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [searchParams, setSearchParams] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isHasMore, setIsHasMore] = useState(true)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])
    const [bookmark, setBookmark] = useState(() => {
        const bookmarked = localStorage.getItem('bookmarked')
        return bookmarked ? JSON.parse(bookmarked) : []
    })
    const [selectedCategory, setSelectedCategory] = useState("")

    const containerRef = useRef(null)
    const observerRef = useRef(null)

    useEffect(() => {
        const searchHandler = setTimeout(() => {
            setSearchParams(search.trim())
        }, 700)

        return () => clearTimeout(searchHandler)
    }, [search])

    useEffect(() => {
        const handleCategories = async () => {
            try {
                const res = await axios.get(`${apiUrl}/categories`)
                setCategories(res.data.categories)
            } catch (err) {
                console.log(err.response)
            }
        }

        handleCategories()
    }, [apiUrl])

    const fetchPosts = useCallback(async (pageToFetch, isReset) => {
        setIsLoading(true)
        setError(null)

        try {
            const params = {
                page: pageToFetch,
                per_page: 3,
            }

            if (searchParams) params.search = searchParams
            if (selectedCategory) params.category = selectedCategory

            const query = new URLSearchParams(params).toString()
            const res = await axios.get(`${apiUrl}/posts?${query}`)

            const items = res.data.data.items

            setPosts(prev => (isReset ? items : [...prev, ...items]))
            setPage(pageToFetch)
            setIsHasMore(pageToFetch < res.data.data.total_page)
        } catch (err) {
            console.log(err)
            setError(err)
        } finally {
            setIsLoading(false)
        }
    }, [apiUrl, searchParams, selectedCategory])

    useEffect(() => {
        setIsHasMore(true)
        fetchPosts(1, true)
    }, [searchParams, selectedCategory])

    const lastPostRef = useCallback((node) => {
        if (isLoading) return

        if (observerRef.current) observerRef.current.disconnect()

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && isHasMore) {
                fetchPosts(page + 1, false)
            }
        }, {
            root: containerRef.current,
            rootMargin: '100px',
            threshold: 0,
        })

        if (node) observerRef.current.observe(node)
    }, [isLoading, isHasMore, page, fetchPosts])

    const handleAddBookmark = (id) => {
        setBookmark(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
    }

    useEffect(() => {
        if (Array.isArray(bookmark)) {
            localStorage.setItem("bookmarked", JSON.stringify(bookmark))
        }
    }, [bookmark])

    return (
        <>
            <Header title="Discover"></Header>

            <div className="main-container" ref={containerRef}>
                <input type="text" id='search' value={search} onChange={e => setSearch(e.target.value)} />

                <select
                    name="selectedCategory"
                    id="selectedCategory"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Category</option>
                    {categories.map(category => (
                        <option key={category.slug} value={category.slug}>{category.name}</option>
                    ))}
                </select>

                <div className="recommendation-news">
                    {posts.length > 0 ? (
                        posts.map((news, index) => {
                            const isLast = index === posts.length - 1

                            return (
                                <div
                                    key={news.id}
                                    className="recommendation-item"
                                    ref={isLast ? lastPostRef : null}
                                >
                                    <Link to={`/posts/${news.slug}`}>
                                        <img src={news.thumbnail} alt={news.title} />
                                        <h5>{news.title}</h5>
                                        <p>{news.category.icon} {news.category.slug}</p>
                                    </Link>

                                    <button onClick={() => handleAddBookmark(news.id)}>
                                        ⭐
                                    </button>
                                </div>
                            )
                        })
                    ) : (
                        !isLoading && <p>No Discover News</p>
                    )}
                </div>

                {isLoading && <p>Loading...</p>}
                {!isHasMore && posts.length > 0 && <p>No more posts</p>}
            </div>
        </>
    )
}

export default DiscoverPage
