import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserEdit = () => {
    const { id } = useParams(); // URL에서 사용자 ID 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [user, setUser] = useState({
        userId: '',
        username: '',
        password: '',
        email: '',
        gender: '', // 기본값 설정
        contact: '',
        birthdate: ''
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${id}`); // 사용자 정보를 가져오는 엔드포인트
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/users/edit/${id}`, user); // 수정 요청
            navigate('/userlist'); // 수정 후 사용자 목록 페이지로 리다이렉션
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            <h1>Edit User</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        User ID:
                        <input type="text" name="userId" value={user.userId} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Username:
                        <input type="text" name="username" value={user.username} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="password" name="password" value={user.password} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input type="email" name="email" value={user.email} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Gender:
                        <select name="gender" value={user.gender} onChange={handleChange}>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Contact:
                        <input type="text" name="contact" value={user.contact} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        Birthdate:
                        <input type="date" name="birthdate" value={user.birthdate} onChange={handleChange} />
                    </label>
                </div>
                <button type="submit">Update User</button>
            </form>
        </div>
    );
};

export default UserEdit;
