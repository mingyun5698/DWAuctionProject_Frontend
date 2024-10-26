import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Login.css'; // CSS 파일을 임포트

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8080/api/login`, formData);
      const token = response.data;
      localStorage.setItem('Authorization', token);
      alert('로그인 성공!');
      navigate('/');
    } catch (error) {
      alert('로그인 실패: ' + (error.response?.data || '알 수 없는 오류'));
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">사용자 ID:</label>
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="button-group">
            <button type="submit" className="login-button">로그인</button>
            <Link to="/signup" className="signup-link">
              <button type="button" className="signup-button">회원가입</button>
            </Link>
          </div>
        </form>
        <div className="link-group">
          <Link to="/user/findaccount" className="link">아이디/비밀번호 찾기</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
