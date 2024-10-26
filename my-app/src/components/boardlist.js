import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Pagination, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Link 컴포넌트 추가
import '../css/AuctionList.css'; // CSS 파일을 임포트

const BoardList = () => {
  const [boardList, setBoardList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // 한 페이지에 보여줄 항목 수
  

  useEffect(() => {
    const fetchBoardList = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/board');
        setBoardList(response.data);
      } catch (error) {
        console.error("There was an error fetching the board list!", error);
      }
    };

    fetchBoardList();
  }, []);

  // 페이지에 표시할 항목을 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // 최신 게시글이 위로 오도록 배열을 역순으로 정렬
  const sortedBoardList = [...boardList].reverse();
  const currentItems = sortedBoardList.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 번호 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지 번호 생성
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(boardList.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Container className="w-75 mb-4">
      <h1 className="mb-4 text-center">무료 감정</h1>
           {/* 글쓰기 버튼 추가 */}
           <div className="text-end mb-4">
        <Link to="/board/create">
          <Button variant="primary">감정 받기</Button>
        </Link>
      </div>
      <Row>
        {currentItems.length > 0 ? (
          currentItems.map(board => (
            <Col key={board.id} xs={12} className="mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    <a
                      href={`/board/${board.id}`}
                      className="text-decoration-none text-dark"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}
                    >
                      <img
                        src={`http://localhost:8080/images/${board.imagePath}`}
                        alt=""
                        style={{ width: '50px', height: '50px', marginRight: '10px' }}
                      />
                      <span style={{ flex: '1', marginRight: '10px' }}>{board.title}</span> 
                      <span style={{ flex: '1', marginRight: '10px' }}>{board.productCategory}</span>
                      <span style={{ flex: '1', marginRight: '10px' }}>{board.productName}</span>
                      <span style={{ flex: '1', marginRight: '10px'}}>{board.userDto.userId}</span>
                    </a>
                  </h5>
                </div>
              </div>
            </Col>
          ))
        ) : (
          <p className="text-center">게시글이 없습니다.</p>
        )}
      </Row>

      <div>

      </div>

      {/* 페이지네이션 */}
      <Pagination className="d-flex justify-content-center mt-4">
        {pageNumbers.map(number => (
          <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
            {number}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default BoardList;
