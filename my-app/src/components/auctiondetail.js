import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';

const AuctionDetail = () => {
  const { id } = useParams(); // 경매 ID 파라미터 가져오기
  const [auction, setAuction] = useState(null); // 경매 상태
  const [remainingTime, setRemainingTime] = useState(''); // 남은 시간 상태
  const [bidFee, setBidFee] = useState(''); // 입찰 금액 상태
  const [bidUser, setBidUser] = useState('');
  const [auctionEnd, setAuctionEnd] = useState(false);
  const [bidData, setBidData] = useState('');
  const navigate = useNavigate();

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 경매 데이터 가져오기
  const fetchAuctionData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/auction/${id}`);
      const data = response.data;
      data.createTime = formatDate(data.createTime);
      data.deadline = formatDate(data.deadline);
      setAuction(data);
      calculateRemainingTime(data.deadline);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('해당 경매를 찾을 수 없습니다.');
      } else {
        console.error('Error fetching auction:', error);
      }
    }
  };

  // 현재 입찰자 정보 가져오기
  const fetchBidUser = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/biduser`, {
        params: { id }
      });
      setBidUser(response.data); // 서버에서 현재 입찰자 정보를 받아와 설정
    } catch (error) {
      console.error('Error fetching bid user:', error);
      alert('입찰자 정보를 가져오는 데 실패했습니다.');
    }
  };

  // 남은 시간 계산 함수
  const calculateRemainingTime = (deadline) => {
    const endTime = new Date(deadline).getTime();
    const now = new Date().getTime();
    let distance = endTime - now;

    if (distance < 0 && !auctionEnd) {
      setRemainingTime('경매가 종료되었습니다.');
      setAuctionEnd(true);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    distance -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(distance / (1000 * 60 * 60));
    distance -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(distance / (1000 * 60));
    distance -= minutes * (1000 * 60);

    const seconds = Math.floor(distance / 1000);

    let formattedTime = '';
    if (days > 0) {
      formattedTime = `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
    } else if (hours > 0) {
      formattedTime = `${hours}시간 ${minutes}분 ${seconds}초`;
    } else if (minutes > 0) {
      formattedTime = `${minutes}분 ${seconds}초`;
    } else {
      formattedTime = `${seconds}초`;
    }

    setRemainingTime(formattedTime);
  };

  useEffect(() => {
    if (auctionEnd) {
      return; // 경매가 종료된 경우, 추가적인 타이머 실행을 막습니다.
    }

    const timer = setInterval(() => {
      if (auction) {
        calculateRemainingTime(auction.deadline);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEnd, auction]);

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    const fetchAuctionAndBidUser = async () => {
      await fetchAuctionData();
      await fetchBidUser();
      await handlebidData();
    };

    fetchAuctionAndBidUser();

    return () => {
      setAuctionEnd(false); // 컴포넌트가 언마운트될 때 auctionEnd를 초기화합니다.
    };
  }, [id]);

  // 경매 삭제 함수
  const handleDelete = async () => {
    const token = localStorage.getItem('Authorization');
    try {
      await axios.delete(`http://localhost:8080/api/auction/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      alert('삭제 완료');
      navigate('/');
    } catch (error) {
      if (error.response) {
        // 서버에서 오류 메시지가 있는 경우
        const errorMessage = error.response.data
        alert(errorMessage);
      } else {
        // 서버에서 오류 메시지가 없는 경우
        alert('삭제 요청 처리 중 오류가 발생했습니다.');
      }
    }
  };






  const handleBid = async (transe) => {
  
    if (auctionEnd) {
      alert('입찰 가능 시간이 지났습니다.');
      return; // 경매가 종료된 경우 입찰을 막습니다.
    }
  
    try {
      const token = localStorage.getItem('Authorization');
      const response = await axios.post(`http://localhost:8080/api/bid`, 
        { id, bidFee: transe }, 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );
      alert('입찰이 성공적으로 접수되었습니다.');
      await handlebidData();
      setBidFee('');
      fetchAuctionData(); // 경매 데이터 다시 가져오기
      setBidUser(response.data); // 입찰자 정보 업데이트
    } catch (error) {
      if (error.response) {
        if (error.response.status === 500) {
          // 401 상태 코드: 로그인 페이지로 이동
          alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
          navigate('/login'); // 로그인 페이지로 네비게이트
        } else {
          // 다른 상태 코드의 에러 처리
          alert(`입찰 오류: ${error.response.data}`);
        }
      } 
      console.error('입찰 오류:', error);
    }
  };
  

  const handlebidData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/bidlist', {
        params: { id }
      });
      setBidData(response.data);
      console.log(response.data);
    } catch (e) {
      console.error('Error fetching bid data:', e);
    }
  };

  useEffect(() => {
    fetchAuctionData();
    fetchBidUser();
    handlebidData();
  }, [id]);


  const handleSuccessfulBid = async () => {

    try {
      await axios.post('http://localhost:8080/api/successfulbid', {
        auctionId: auction.id,
        bidUserId: bidUser.id,
      });
    } catch (error) {
      console.error('낙찰 처리 오류:', error);
      console.error(auction.id);
      console.error(bidUser.id);
      alert('낙찰 처리 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    if (auctionEnd) {
      handleSuccessfulBid(); // 경매 종료 시 자동으로 낙찰 처리 함수 호출
      return; // 경매가 종료된 경우, 추가적인 타이머 실행을 막습니다.
    }

    const timer = setInterval(() => {
      if (auction) {
        calculateRemainingTime(auction.deadline);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auctionEnd, auction]);

  const sortedBidData = [...bidData].reverse();
  

  // 경매 상세 페이지 렌더링
  return (
    <>
  <Container className="w-75 d-flex justify-content-center mb-4 mt-4">
      <div className="w-100 text-left border border-dark p-4 d-flex flex-column">
      <h2 className="text-center">
  {auction ? auction.title : '로딩 중...'}
</h2>
        <div className="d-flex">
          <div className="w-50 border-end border-dark border-2 p-2 d-flex flex-column justify-content-center align-items-center">
  {auction && auction.imagePath && (
    <img
  src={`http://localhost:8080/images/${auction.imagePath}`}
  alt="게시글 이미지"
  style={{ width: '300px', height: 'auto' }}  // 원하는 크기로 조정
/>
  )}
  <p>{auction ? auction.productName : '로딩 중...'}</p>
  <p>{auction ? auction.contents : '로딩 중...'}</p>
</div>
          
          {/* 오른쪽 공간: 경매 정보 및 버튼들 */}
          <div className="w-50 p-2 border-start border-dark border-2">
            {auction ? (
              <>
                  <>
                    <p>경매 ID: {auction.id}</p>
                    <p>상품 카테고리: {auction.productCategory}</p>
                    <p>현재입찰가: {auction.bidFee} 원</p>
                    <p>작성시간: {auction.createTime}</p>
                    <p>마감일: {auction.deadline}</p>
                    <p>남은 시간: {remainingTime}</p>
                    <p>판매자: {auction.userDto.userId}</p>
                    
                    <div>
                      <h2>
                        {auctionEnd ? `낙찰자: ${bidUser.userId || '낙찰자가 없습니다'}` : `현재 입찰자: ${bidUser.userId || '입찰자가 없습니다'}`}
                      </h2>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>입찰 금액</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="입찰 금액을 입력하세요"
                        value={bidFee}
                        onChange={(e) => setBidFee(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Button variant="success" onClick={() => handleBid(bidFee)} className="me-2">
  입찰하기
</Button>
                    <Button variant="danger" onClick={handleDelete}>
                      삭제
                    </Button>
                  </>
                
              </>
            ) : (
              <p>로딩 중...</p>
            )}
          </div>
        </div>
      </div>
    </Container>

    <Container className="w-75 d-flex justify-content-center mb-4">
      <div className="w-100 text-left border border-dark p-4">
        <h3>입찰 기록</h3>
        {sortedBidData.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>입찰자</th>
                <th>입찰 금액</th>
                <th>입찰 시간</th>
              </tr>
            </thead>
            <tbody>
              {sortedBidData.map((bid) => (
                <tr key={bid.id}>
                  <td>{bid.userDto.userId}</td>
                  <td>{bid.bidFee} 원</td>
                  <td>{formatDate(bid.bidTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>입찰 기록이 없습니다.</p>
        )}
      </div>
    </Container>
    </>
    
  );
};

export default AuctionDetail;
