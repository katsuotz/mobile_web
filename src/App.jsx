import { Route, Routes } from "react-router"
import HomePage from "./page/HomePage"
import Navbar from "./components/Navbar"
import DiscoverPage from "./page/DiscoverPage"
import BookmarkPage from "./page/BookmarkPage"
import DetailNewsPage from "./page/DetailNewsPage"
import SettingPage from "./page/SettingPage"

function App() {

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/discover" element={<DiscoverPage />}></Route>
        <Route path="/bookmark" element={<BookmarkPage />}></Route>
        <Route path="/setting" element={<SettingPage />}></Route>
        <Route path="/posts/:slug" element={<DetailNewsPage />}></Route>
      </Routes>
      <Navbar></Navbar>
    </div>
  )
}

export default App
