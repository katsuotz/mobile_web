import { useNavigate } from "react-router"

const Header = ({ title, showBack = false }) => {
    const navigate = useNavigate()
    return (
        <header className="app-header">
            {showBack && <button className="back-button" type="button" onClick={() => navigate(-1)} aria-label="Go back">←</button>}
            <h1>{title}</h1>
        </header>
    )
}

export default Header
