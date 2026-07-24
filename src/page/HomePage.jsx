import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'

const HomePage = () => {
    const apiUrl = "http://127.0.0.1:8000/api/v1"
    const [breakingNews, setBreakingNews] = useState([])
    const [recommendationNews, setRecommendationNews] = useState([])
    const selectedCategory = JSON.parse(localStorage.getItem("selectedCategory")) || []

    useEffect(() => {
        const getNews = async () => {
            try {
                const res = await axios.get(`${apiUrl}/posts`)
                setBreakingNews(res.data.data.items)
                console.log(res.data.data.items);

                if (selectedCategory) {
                    setRecommendationNews(res.data.data.items.filter(news => selectedCategory.includes(news.category.slug)))
                }
            } catch (err) {
                console.log(err.response);
            }
        }

        getNews()
    }, [])
    return (
        <>
            <Header title="Home"></Header>
            <div className="main-container">
                <div className="carousel">
                    {breakingNews.map((news) => (
                        <div className="carousel-item" key={news.id}>
                            <img src={news.thumbnail} alt={news.title} />
                        </div>
                    ))}
                </div>

                <h4>Recommendation News</h4>
                <div className="recommendation-news">
                    {recommendationNews && recommendationNews.length > 0 ? recommendationNews.map(news => (
                        <div className="recommendation-item">
                            <img src={news.thumbnail} alt={news.title} />
                            <h5>{news.title}</h5>
                            <span>{news.category.icon} {news.category.slug}</span>
                        </div>

                    )) : (
                        <p>No Recommendation News</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default HomePage