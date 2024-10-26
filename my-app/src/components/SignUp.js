import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SignUp.css'; // CSS 파일을 임포트

const SignUp = () => {
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    birthdate: '',
    gender: '',
    contact: '',
  });

  const navigate = useNavigate();

  const [emailError, setEmailError] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailSuccess, setIsEmailSuccess] = useState(false);
  const [emailForm, setEmailForm] = useState(false);
  const [isIdSuccess, setIsIdSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // 이메일 형식 검증
    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setEmailError('올바른 이메일 형식이 아닙니다!');
      } else {
        setEmailError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEmailSuccess === false) return alert("이메일 인증을 해주세요");
    if (isIdSuccess === false) return alert("아이디 중복체크를 확인 해주세요");
    try {
      const response = await axios.post(`http://localhost:8080/api/users/signup`, formData);
      alert('회원가입 성공!');
      console.log('Response:', response.data);
      navigate('/');
    } catch (error) {
      alert('회원가입 실패: ' + (error.response?.data || '알 수 없는 오류'));
      console.error('Error:', error);
    }
  };

  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
  };

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const sendEmailAuth = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/email', { email: formData.email });
      if (response.status === 200) {
        const data = response.data;
        setAuthCode(data); // 서버에서 받은 인증 코드 설정
        setEmailForm(true);
        console.log('Authentication code received:', data);
        alert("이메일이 발송되었습니다.");
      } else if (response.status === 400) {
        const errorData = response.data;
        alert(errorData); // 서버에서 반환된 오류 메시지 표시
      } else {
        throw new Error('이메일 발송 요청 실패:', response.statusText);
      }
    } catch (error) {
      console.error('이메일 발송 오류:', error);
      alert('하나의 이메일로 하나의 계정만 만들 수 있습니다.');
    }
  };

  const verifyAuthCode = () => {
    const stringAuthCode = String(authCode);

    if (verificationCode.trim() === "") {
      alert("공백입니다.")
      setIsEmailSuccess(false); // 공백인 경우 실패
      return false;
    }

    if (stringAuthCode === verificationCode) {
      alert("인증 성공");
      setIsEmailSuccess(true); // 인증 성공
      setEmailForm(false);
      return true;
    } else {
      alert("인증 실패");
      setIsEmailSuccess(false); // 인증 실패
      return false;
    }
  };

  const handleIdCheck = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/idcheck', { userId: formData.userId });
      alert('아이디 사용 가능합니다.');
      setIsIdSuccess(true);
    } catch (error) {
      console.error('아이디 체크 요청 실패:', error);
      alert('이미 중복된 아이디입니다.');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>사용자 ID</label>
            <div className="input-wrapper">
              <input type="text" name="userId" value={formData.userId} onChange={handleChange} required />
              <button type="button" className="btn check-id-button" onClick={handleIdCheck}>중복 체크</button>
            </div>
          </div>
          <div className="form-group">
            <label>이름</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <div className="input-wrapper">
              <input type="email" name="email" value={formData.email} onChange={handleEmailChange} required />
              <button type="button" className="btn send-email-button" onClick={sendEmailAuth}>인증 발송</button>
            </div>
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
          
          {emailForm && (
            <div className="form-group">
            <div className="input-wrapper">
              <input
                type="text"
                name="text"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                placeholder="인증번호 입력"
              />
              <button type="button" className="btn verify-button" onClick={verifyAuthCode}>인증 확인</button>
            </div>
            </div>
          )}
          <div className="form-group">
            <label>생년월일</label>
            <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>성별</label>
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>연락처</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
          </div>
          <div className="form-group right-align">
  <button type="submit" className="btn submit-button">회원가입</button>
</div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
