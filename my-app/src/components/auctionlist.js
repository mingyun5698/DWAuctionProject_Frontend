import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import '../css/AuctionList.css';

const AuctionList = () => {
  const [auctionList, setAuctionList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [searchCategory, setSearchCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const location = useLocation();

  // 쿼리 파라미터에서 검색어와 검색 유형을 읽어오는 함수
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      type: params.get('type') || 'title',
    };
  };

  // 전체 경매 목록을 가져오는 함수
  const fetchAllAuctions = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/auction');
      setAuctionList(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('해당 경매를 찾을 수 없습니다.');
      }
    }
  };

  // 검색된 경매 데이터를 가져오는 함수
  const fetchAuctionData = async (searchTerm = '', searchType = 'title') => {
    try {
      const response = await axios.get('http://localhost:8080/api/auction', {
        params: { search: searchTerm, type: searchType }
      });
      setAuctionList(response.data);
      setCurrentPage(1);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('해당 경매를 찾을 수 없습니다.');
      }
    }
  };

  // 카테고리 클릭 핸들러
  const handleCategoryClick = (category) => {
    setSearchType('productCategory');
    setSearchCategory(category);
    fetchAuctionData(category, 'productCategory');
  };

  // 검색 버튼 클릭 시 호출되는 핸들러
  const handleSearch = (event) => {
    event.preventDefault();
    fetchAuctionData(searchTerm, searchType);
  };

  // 컴포넌트가 마운트될 때 전체 목록을 가져옴
  useEffect(() => {
    const { search, type } = getQueryParams();
    setSearchTerm('');
    setSearchType(type);
    fetchAuctionData(search, type);
  }, [location]);

  // 페이지에 표시할 항목을 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedAuctionList = [...auctionList].reverse();
  const currentItems = sortedAuctionList.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(auctionList.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="layout">
      {/* 왼쪽 사이드바 */}
      <div className="sidebar">
        <h5>카테고리 검색기능</h5>
        <p onClick={() => handleCategoryClick('')}>전체</p>
        <p onClick={() => handleCategoryClick('의류')}>의류</p>
        <p onClick={() => handleCategoryClick('전자기기')}>전자기기</p>
        <p onClick={() => handleCategoryClick('가구')}>가구</p>
        <p onClick={() => handleCategoryClick('화장품')}>화장품</p>
        <p onClick={() => handleCategoryClick('주방용품')}>주방용품</p>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="content">
        <div className="w-100 mb-4 ">
          <h1 className="mb-4 text-center ">경매 목록</h1>
          <form onSubmit={handleSearch} className="d-flex justify-content-end mt-4">
            <div className="input-group mb-3 w-50">
              <select
                className="form-select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="title">제목으로 검색</option>
                <option value="productName">상품명으로 검색</option>
                <option value="username">사용자명으로 검색</option>
              </select>
              <input
                type="text"
                className="form-control"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">검색</button>
            </div>
          </form>
          <Row>
            {currentItems.length > 0 ? (
              currentItems.map(auction => (
                <Col key={auction.id} xs={12} className="mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link
                          to={`/auction/${auction.id}`}
                          className="text-decoration-none text-dark"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                          }}
                        >
                          <img
                            src={`http://localhost:8080/images/${auction.imagePath}`}
                            alt=""
                            className="image-spacing"
                          />
                          <span style={{ flex: '1', marginRight: '10px' }}>{auction.title}</span> 
                          <span style={{ flex: '1', marginRight: '10px' }}>{auction.productCategory}</span>
                          <span style={{ flex: '1', marginRight: '10px' }}>{auction.productName}</span>
                          <span style={{ flex: '1', marginRight: '10px'}}>현재입찰가 : {auction.bidFee}원</span>
                          <span style={{ flex: '1', marginRight: '10px'}}>{auction.userDto.userId}</span>
                        </Link>
                      </h5>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <p className="text-center">경매 목록이 없습니다.</p>
            )}
          </Row>
        </div>

        <div className="w-100 mb-4">
          <div className="d-flex justify-content-end mt-4">
            <Link to="/auction/create">
              <button className="btn btn-success" type="button">경매 등록</button>
            </Link>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="w-100 mb-4  d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            />
            {pageNumbers.map(number => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => currentPage < pageNumbers.length && setCurrentPage(currentPage + 1)}
            />
          </Pagination>
        </div>
      </div>

      {/* 오른쪽 사이드바 */}
      <div className="sidebar-right">
      </div>
    </div>
  );
};

export default AuctionList;
