import React, { useEffect, useRef, useState } from 'react'
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
                console.log(res.data.categories);

            } catch (err) {
                console.log(err.response);

            }
        }

        handleCategories()
    }, [apiUrl])


    useEffect(() => {
        const getPosts = async () => {
            if (!isHasMore && page !== 1) return

            setIsLoading(true)
            setError(null)

            try {
                const params = {
                    page: page,
                    per_page: 3
                }

                if (searchParams) params.search = searchParams
                if (selectedCategory) params.category = selectedCategory

                const queryString = new URLSearchParams(params).toString()


                const res = await axios.get(`${apiUrl}/posts?${queryString}`)

                const newPosts = res.data.data.items
                console.log(newPosts);

                setPosts(prev => page === 1 ? newPosts : [...prev, ...newPosts])
                setIsHasMore(newPosts.length > 0 && page < res.data.data.totalPage)
            } catch (err) {
                console.log(err.response);

            } finally {
                setIsLoading(false)
            }
        }

        getPosts()
    }, [apiUrl, page, selectedCategory, isHasMore, searchParams])

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current
            if (container.scrollHeight === container.scrollTop + container.clientHeight && isHasMore && !loading) {
                setPage(prev => prev + 1)
            }
        }

        const container = containerRef.current
        container.addEventListener('scroll', handleScroll)
    }, [isHasMore, isLoading])

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

                <select name="selectedCategory" id="selectedCategory" value={selectedCategory} onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setPage(1)
                    setPosts([])
                    setIsHasMore(true)
                }}>
                    <option value="">All Category</option>
                    {categories.map(category => (
                        <option value={category.slug}>{category.name}</option>
                    ))}
                </select>

                {posts && posts.length > 0 ? posts.map(news => (
                    <div className="recommendation-item">
                        <Link to={`/posts/${news.slug}`}>
                            <img src={news.thumbnail} alt={news.title} />
                            <h5>{news.title}</h5>
                            <p>{news.category.icon} {news.category.slug}</p>
                        </Link>
                        <button onClick={() => handleAddBookmark(news.id)}>⭐</button>
                    </div>

                )) : (
                    <p>No Discover News</p>
                )}
            </div>
        </>
    )
}

export default DiscoverPage