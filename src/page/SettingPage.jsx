import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { useTheme } from '../Context/ThemeContext'

const SettingPage = () => {
    const apiUrl = "http://127.0.0.1:8000/api/v1"

    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const selected = localStorage.getItem("selectedCategory")
        return selected ? JSON.parse(selected) : []
    })
    const { theme, toggleTheme } = useTheme()

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

    const handleSelectedCategories = (slug) => {
        console.log(slug);

        setSelectedCategory(prev => prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug])
    }

    useEffect(() => {
        if (Array.isArray(selectedCategory)) {
            localStorage.setItem("selectedCategory", JSON.stringify(selectedCategory))
        }
    }, [selectedCategory])


    const handleChange = (e) => {
        toggleTheme(e.target.value);
    };

    return (
        <>

            <Header title="Settings"></Header>

            <div className="main-container">
                <div className="menu">
                    <span>Theme Mode</span>
                    <select
                        name="themeMode"
                        id="themeMode"
                        value={theme}
                        onChange={handleChange}
                    >
                        <option value="system">System</option>
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                    </select>
                </div>
                <br />

                <p>Preference Category :</p>
                <br />
                <div className="categories-list">
                    {categories.map(c => (
                        <button
                            key={c.id}
                            onClick={() => handleSelectedCategories(c.slug)}
                            className={selectedCategory.includes(c.slug) ? "active" : ""}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>
            </div>


        </>
    )
}

export default SettingPage