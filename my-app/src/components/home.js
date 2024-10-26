import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Home.css'; // CSS 파일을 임포트

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [searchCategory, setSearchCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    // 검색어와 검색 유형을 URL 쿼리 파라미터로 설정하고 AuctionList 페이지로 이동
    navigate(`/auctionlist?type=${searchType}&search=${searchTerm}`);
  };

  const handleCategorySearch = () => {
    // 카테고리 검색 시 type을 'category'로 설정
    navigate(`/auctionlist?type=productCategory&search=${searchCategory}`);
  };

  return (
    <Container className='mt-4 bg-white shadow-sm'>
              <div className="custom">
                DW Auction에 오신걸 환영합니다.
            </div>
      <div className='mt-4 mb-4 d-flex'>
      <div className='flex-grow-1 d-flex justify-content-center align-items-center'>
  <img src="https://previews.123rf.com/images/hxdbzxy/hxdbzxy1411/hxdbzxy141100656/33783596-%EA%B2%BD%EB%A7%A4-%ED%8C%A8%EB%A5%BC-%EB%93%A4%EA%B3%A0-%EC%82%AC%EB%9E%8C%EB%93%A4%EC%9D%80-%EA%B2%BD%EB%A7%A4%EC%97%90%EC%84%9C-%EA%B5%AC%EC%9E%85%ED%95%A9%EB%8B%88%EB%8B%A4.jpg" alt="경매 패널" className="custom-img" />
</div>
        <div className='flex-grow-2 mt-4 border-container'> {/* 오른쪽 공간 */}
          <Form onSubmit={handleSearch}>
            <Form.Group controlId="searchType">
              <Form.Label>검색 유형</Form.Label>
              <Form.Control
                as="select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="title">제목</option>
                <option value="productName">상품명</option>
                <option value="username">사용자명</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="searchTerm">
              <Form.Label>검색어</Form.Label>
              <Form.Control
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
            <div className='d-flex justify-content-end'> {/* 버튼 우측 정렬 */}
              <Button variant="primary" type="submit">
                경매 검색
              </Button>
            </div>
          </Form>

          <Form className='mt-4'>
            <Form.Group controlId="productCategory">
              <Form.Label>카테고리로 검색</Form.Label>
              <Form.Control
                as="select"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
              >
                <option value="">전체</option>
                <option value="의류">의류</option>
                <option value="전자기기">전자기기</option>
                <option value="가구">가구</option>
                <option value="화장품">화장품</option>
                <option value="주방용품">주방용품</option>
              </Form.Control>
            </Form.Group>
            <div className='d-flex justify-content-end'> {/* 버튼 우측 정렬 */}
              <Button variant="primary" type="button" onClick={handleCategorySearch}>
                카테고리 검색
              </Button>
            </div>
          </Form>

          <br />
          <div className='containerBox'>
          <Link to="/auctionlist" className='square-box'>
              <div className='text-line'>경매목록</div>
              <div className='text-line'>보러가기</div>
            </Link>
            <Link to="/auction/create" className='square-box'>
              <div className='text-line'>경매글</div>
              <div className='text-line'>쓰러가기</div>
              </Link>
              <Link to="/board/create" className='square-box'>
              <div className='text-line'>전문가에게</div>
              <div className='text-line'>무료감정받기</div>
              </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;
