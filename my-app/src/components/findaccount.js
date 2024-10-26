import React, { useState } from 'react';
import axios from 'axios';
import '../css/FindAccount.css'; // CSS 파일을 추가하여 스타일을 적용

const FindAccount = () => {
    const [userId, setUserId] = useState('');
    const [findIdEmail, setFindIdEmail] = useState('');
    const [findPasswordEmail, setFindPasswordEmail] = useState('');
    const [findIdMessage, setFindIdMessage] = useState('');
    const [findPasswordMessage, setFindPasswordMessage] = useState('');

    const handleFindId = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/findid', { email: findIdEmail });
            setFindIdMessage(response.data);
        } catch (error) {
            console.error('아이디 찾기 오류:', error);
            setFindIdMessage('아이디를 찾지 못했습니다.');
        }
    };

    const handleFindPassword = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/findpassword', { userId, email: findPasswordEmail },
                {
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                }
            );
            setFindPasswordMessage(response.data);
        } catch (error) {
            console.error('비밀번호 찾기 오류:', error);
            setFindPasswordMessage('비밀번호를 찾지 못했습니다.');
        }
    };

    return (
        <div className="find-account-container">
            <div className="find-account-box">
                <div className="find-account-section">
                    <h2>아이디 찾기</h2>
                    <div>
                        <label>Email</label>
                        <input
                            type="text"
                            placeholder="Enter email"
                            value={findIdEmail}
                            onChange={(e) => setFindIdEmail(e.target.value)}
                        />
                    </div>
                    <div className="button-container">
                        <button onClick={handleFindId}>Find ID</button>
                    </div>
                    {findIdMessage && <p>{findIdMessage}</p>}
                </div>
                <div className="find-account-section">
                    <h2>비밀번호 찾기</h2>
                    <div>
                        <label>User ID</label>
                        <input
                            type="text"
                            placeholder="Enter user ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="text"
                            placeholder="Enter email"
                            value={findPasswordEmail}
                            onChange={(e) => setFindPasswordEmail(e.target.value)}
                        />
                    </div>
                    <div className="button-container">
                        <button onClick={handleFindPassword}>Find Password</button>
                    </div>
                    {findPasswordMessage && <p>{findPasswordMessage}</p>}
                </div>
            </div>
        </div>
    );
};

export default FindAccount;
