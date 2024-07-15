import { useState, useEffect } from "react"
import InfiniteScholl from "./components/InfiniteScholl"

function App() {

  const [post, setPost] = useState([]);
  const [page, setPage] = useState(0);
  const[isloading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchPosts = async() => {

    if(isloading) return;

    setIsLoading(true);

    try {
      
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`)
      const data = await response.json()
      if(data.length > 0) {
        setPost((prevPost) => [...prevPost, ...data]);
      } else {
        setHasMoreData(false);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [page])

  const handleScroll = () => {
    if(window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 && !isloading && hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  }

  useEffect(() => {

    const throttleHandleScroll = throtlle(handleScroll, 150)
    window.addEventListener('scroll' , throttleHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttleHandleScroll);
    }
  }, [hasMoreData, isloading])

  return (
    <div>
      <h1>Infinite Scroll</h1>
      <ul>
        {post.map((post) => (
          <li key={Math.random() * 1000}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
      {isloading && <p>Carregando mais post...</p>}
    </div>
  )
}

function throtlle(func, delay) {
  let lastCall = 0;

  return function(...args) {
    const now = new Date().getTime();
    if(now - lastCall < delay) return
    lastCall = now
    return func(...args);
  }
}

export default App
