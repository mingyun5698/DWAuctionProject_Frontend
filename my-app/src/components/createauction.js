import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/AuctionForm.module.css'; // CSS 모듈 임포트

const AuctionForm = () => {
  const [auctionData, setAuctionData] = useState({
    title: '',
    contents: '',
    bidFee: '',
    productName: '',
    productCategory: '',
    hoursToAdd: '' // 종료 시간에 추가할 시간을 입력하는 필드
  });
  const [file, setFile] = useState(null); // 업로드된 파일을 보유
  const [userValid, setUserValid] = useState(true); // 유저 인증 상태
  const navigate = useNavigate();

  useEffect(() => {
    // 로그인된 유저 정보 확인
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const response = await axios.post('http://localhost:8080/api/inlogin', {}, {
          headers: {
            'Authorization': token,
          },
        });
        // 유저 인증 성공 시
        if (response.status === 200) {
          setUserValid(true);
        }
      } catch (error) {
        // 유저 인증 실패 시 로그인 페이지로 이동
        setUserValid(false);
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuctionData({
      ...auctionData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // 업로드된 파일을 저장
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('Authorization');

    // 이미지가 첨부되지 않았을 경우 경고
    if (!file) {
      alert('사진을 첨부해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', auctionData.title);
    formData.append('contents', auctionData.contents);
    formData.append('bidFee', auctionData.bidFee);
    formData.append('hoursToAdd', auctionData.hoursToAdd);
    formData.append('productName', auctionData.productName);
    formData.append('productCategory', auctionData.productCategory);

    try {
      const response = await axios.post('http://localhost:8080/api/auction/create', formData, {
        headers: {
          'Authorization': token,
        },
      });

      console.log('경매 생성 완료:', response.data);
      alert('경매가 성공적으로 생성되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('경매 생성 오류:', error);
      alert('경매 생성 중 오류가 발생했습니다.');
    }
  };

  if (!userValid) {
    // 유저 인증 실패 시 렌더링 방지
    return null;
  }

  return (
    <div className={styles.container}>
      <h2>경매 생성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input type="text" name="title" value={auctionData.title} onChange={handleInputChange} required />
        </div>
        <div>
          <label>상품 명</label>
          <input type="text" name="productName" value={auctionData.productName} onChange={handleInputChange} required />
        </div>
        <div>
          <label>상품 내용</label>
          <textarea name="contents" value={auctionData.contents} onChange={handleInputChange} required />
        </div>
        <div>
          <label>입찰가</label>
          <input type="number" name="bidFee" value={auctionData.bidFee} onChange={handleInputChange} required />
        </div>
        <div>
          <label>경매 시간 (hours)</label>
          <input type="number" name="hoursToAdd" value={auctionData.hoursToAdd} onChange={handleInputChange} />
        </div>
        <div>
          <label>상품 카테고리</label>
          <select name="productCategory" value={auctionData.productCategory} onChange={handleInputChange} required>
            <option value="">카테고리를 선택하세요</option>
            <option value="의류">의류</option>
            <option value="전자기기">전자기기</option>
            <option value="가구">가구</option>
            <option value="화장품">화장품</option>
            <option value="주방용품">주방용품</option>
          </select>
        </div>
        <div>
          <label>사진 첨부</label>
          <input type="file" onChange={handleFileChange} accept="image/*" />
        </div>
        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary">경매 생성</button>
        </div>
      </form>
    </div>
  );
};

export default AuctionForm;
