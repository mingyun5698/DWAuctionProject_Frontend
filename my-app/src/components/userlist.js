import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [isTableVisible, setIsTableVisible] = useState(true); // 상태를 추가하여 테이블의 표시 여부를 제어

    const toggleTableVisibility = () => {
        setIsTableVisible(prevState => !prevState); // 상태를 토글하여 테이블 표시/숨기기
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/users/alluser');
            setUsers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`http://localhost:8080/api/users/delete/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };


    return (
        <div className="container">
        <h1>모든 유저 목록</h1>
        <button onClick={toggleTableVisibility}>
          {isTableVisible ? 'Hide Table' : 'Show Table'}
        </button>
        {isTableVisible && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Birthdate</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>User Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.userId}</td>
                    <td>{user.username}</td>
                    <td>{user.birthdate}</td>
                    <td>{user.gender}</td>
                    <td>{user.email}</td>
                    <td>{user.contact}</td>
                    <td>{user.userType}</td>
                    <td>
                      <Link to={`/users/edit/${user.id}`}>
                        <button>Edit</button>
                      </Link>
                      <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
};

export default UserList;
