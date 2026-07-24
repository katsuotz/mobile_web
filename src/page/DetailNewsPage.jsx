import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import Header from '../components/Header'
import axios from 'axios'

const DetailNewsPage = () => {
    const apiUrl = "http://127.0.0.1:8000/api/v1"
    const { slug } = useParams()
    const [news, setNews] = useState([])

    useEffect(() => {
        const getNews = async () => {
            try {
                const res = await axios.get(`${apiUrl}/posts/${slug}`)
                setNews(res.data.data)
                console.log(res.data.data);
            } catch (err) {
                console.log(err);
            }
        }


        getNews()
    }, [slug])
    return (
        <>
            <Header title="Detail News" showBack />

            <div className="main-container">
                <p>Category: {news.category && news.category.name}</p>
                <p>Title: {news.title && news.title}</p>
                <p>Publish Date: {news.created_at && news.created_at}</p>
                <p>Visited: {news.views && news.views}</p>
                <img src={`${news.thumbnail}`} className='thumbnail-cover' alt="" />
                <p>Content: {news.content && news.content}</p>
            </div>
        </>
    )
}

export default DetailNewsPage