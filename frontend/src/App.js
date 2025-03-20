import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PostProvider } from './context/PostContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import EditPostPage from './pages/EditPostPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <PostProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/posts/new" element={<CreatePostPage />} />
              <Route path="/posts/:id" element={<PostDetailPage />} />
              <Route path="/posts/:id/edit" element={<EditPostPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Blog Post Manager</p>
          </footer>
        </div>
      </Router>
    </PostProvider>
  );
}

export default App;
