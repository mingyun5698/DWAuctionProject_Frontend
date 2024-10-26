import React, { useState, useEffect } from 'react';
import './css/Header.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('Authorization'));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('Authorization'));
    };

    // localStorage 변화를 감지
    window.addEventListener('storage', handleStorageChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('Authorization'));
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('Authorization');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="header">
      <div className="logo">
        <Link to="/">
          <img src="https://img.freepik.com/premium-vector/auction-logo-initial-letter-design-template-inspiration_340145-109.jpg" alt="Auction Logo" />
        </Link>
      </div>
      <div className="nav-container">
        <div className="center-links">
          <div className="nav-links">
            <Link to="/auctionlist" className="login-link">경매목록</Link>
            <Link to="/board/list" className="login-link">무료감정</Link>
          </div>
        </div>
        <div className="nav-links">
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="login-link">내정보</Link>
              <Link to="/" onClick={handleLogout} className="logout-link">로그아웃</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="login-link">로그인</Link>
              <Link to="/signup" className="login-link">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
