import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css'; // CSS 파일을 임포트
import UniqueBids from './mybidlist';
import SuccessfulBids from './mysuceesfulbidlist';
import MyAuctionList from './myauctionlist';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const handleAdminLinkClick = () => {
    navigate('/management'); // 클릭 시 /management로 이동
  };

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
        setFormData(response.data);
      } catch (error) {
        setError('사용자 정보를 가져오는 데 실패했습니다.');
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('Authorization');
      await axios.put('http://localhost:8080/api/users/mypage', formData, {
        headers: {
          'Authorization': token
        }
      });
      setUser(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/delete/${userId}`);
      localStorage.removeItem('Authorization');
      navigate('/');
    } catch (error) {
      console.error('Error deleting user profile:', error);
    }
  };

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h1>내 정보</h1>
        {isEditing ? (
          <div>
            <div className="form-group">
              <label>사용자 ID:</label>
              <input type="text" name="userId" value={formData.userId} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>이름:</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>이메일:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>생년월일:</label>
              <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>성별:</label>
              <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>연락처:</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
            </div>
            <div className="button-group">
              <button onClick={handleSave}>저장</button>
              <button onClick={handleEditToggle}>취소</button>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>사용자 ID:</strong> {user.userId}</p>
            <p><strong>이름:</strong> {user.username}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            <p><strong>생년월일:</strong> {user.birthdate}</p>
            <p><strong>성별:</strong> {user.gender}</p>
            <p><strong>연락처:</strong> {user.contact}</p>
            {user.userType === 'ADMIN' &&<p>
          <strong
            style={{ cursor: 'pointer', color: 'blue' }} // 클릭 가능한 링크 스타일
            onClick={handleAdminLinkClick}
          >
            관리 링크
          </strong>
        </p>}
            <div className="button-group">
              <button onClick={handleEditToggle}>수정</button>
              <button onClick={() => handleDelete(user.id)}>삭제</button>
            </div>
          </div>
        )}
      </div>
      <div className="profile-box">
        <MyAuctionList/>
      </div>
      <div className="profile-box">
        <UniqueBids />
      </div>
      <div className="profile-box">
        <SuccessfulBids />
      </div>
    </div>
  );
};

export default Profile;
