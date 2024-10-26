// Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserList from './userlist';
import CurrentBids from './allbidlist';
import AllSuccessfulBids from './allsuccessfulbidlist';
import '../css/CommonStyles.css'; // 공통 스타일 임포트
import { useNavigate } from 'react-router-dom';


const Management = () => {
  // 상태 및 기타 로직을 이곳에서 처리할 수 있습니다.
  const [user1, setUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
        const token = localStorage.getItem('Authorization');
        try {
            const response = await axios.get('http://localhost:8080/api/users/mypage', {
                headers: {
                    'Authorization': token
                }
            });
            setUser(response.data);
            console.log(user1)

            // Check if user.userType is not ADMIN
            if (response.data.userType !== 'ADMIN') {
                navigate('/'); // Redirect to home page if user is not ADMIN
            }
        } catch (error) {
            setError('사용자 정보를 가져오는 데 실패했습니다.');
            console.error('Error fetching user profile:', error);
            navigate('/'); // Redirect to home page if user is not ADMIN
        } finally {
            setLoading(false);
        }
    };

    fetchUserProfile();
}, [navigate]);

  

  return (
    <div 
    >
      <UserList />
      <CurrentBids />
      <AllSuccessfulBids />
    </div>
  );
};

export default Management;
