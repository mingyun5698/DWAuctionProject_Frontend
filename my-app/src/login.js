// LoginDto.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginData, setLoginData] = useState({
    memberId: '',
    password: '',
  });

  const navigate = useNavigate();

  

  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:8080/api/login', loginData, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

              const token = response.data;
        localStorage.setItem('Authorization', token);
        navigate('/');
    } catch (error) {
      console.error('Error during login:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>아이디:</label>
          <input type="text" name="memberId" value={loginData.memberId} onChange={handleInputChange} />
        </div>
        <div>
          <label>비밀번호:</label>
          <input type="password" name="password" value={loginData.password} onChange={handleInputChange} />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
