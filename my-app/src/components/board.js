import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/AuctionForm.module.css'; // CSS 모듈 임포트

const CreateBoardForm = () => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [file, setFile] = useState(null);
  const [userValid, setUserValid] = useState(true); // 유저 인증 상태
  const navigate = useNavigate();

  const categories = [
    '의류',
    '전자기기',
    '가구',
    '화장품',
    '주방용품'
  ];

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('Authorization');

    // 이미지가 첨부되지 않았을 경우 경고
    if (!file) {
      alert('이미지 파일을 첨부해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('contents', contents);
    formData.append('productName', productName);
    formData.append('productCategory', productCategory);
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/api/board', formData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data', // formData를 보낼 때 필요한 헤더
        },
      });
      console.log('게시글 생성 성공:', response.data);
      alert('게시글이 성공적으로 생성되었습니다.');
      // 성공 시 페이지 이동
      navigate('/board/list');
    } catch (error) {
      console.error('게시글 생성 실패:', error);
      alert('게시글 생성 중 오류가 발생했습니다.');
    }
  };

  if (!userValid) {
    // 유저 인증 실패 시 렌더링 방지
    return null;
  }

  return (
    <div className={styles.container}>
        <h1 className="text-center">감정 받기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>내용</label>
          <textarea
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>상품명</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>상품 카테고리</label>
          <select
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            required
          >
            <option value="" disabled>카테고리를 선택하세요</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>이미지 파일</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required // 파일 입력 필드가 필수로 변경되었습니다
          />
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className="btn btn-primary">게시글 생성</button>
        </div>
      </form>
    </div>
  );
};

export default CreateBoardForm;
