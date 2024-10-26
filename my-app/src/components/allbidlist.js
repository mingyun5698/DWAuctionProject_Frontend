import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const CurrentBids = () => {
    const [bids, setBids] = useState([]);
    const [error, setError] = useState(null);
    const [isTableVisible, setIsTableVisible] = useState(true); // 테이블 표시 상태
    const navigate = useNavigate();

    const handleRowClick = (auctionId) => {
        navigate(`/auction/${auctionId}`); // navigate 함수를 사용하여 페이지 이동
    };

    const toggleTableVisibility = () => {
        setIsTableVisible(!isTableVisible);
      };

    

    useEffect(() => {
        const fetchCurrentBids = async () => {
            try {
                const token = localStorage.getItem('Authorization');
                const response = await axios.get('http://localhost:8080/api/bidnow', {
                    headers: {
                        'Authorization': token,
                    },
                });
                setBids(response.data); // API 응답 데이터 설정
            } catch (err) {
                console.error('Error fetching current bids:', err);
                setError('Failed to fetch bids');
            }
        };

        fetchCurrentBids();
    }, []);

    return (
        <div className="container">
        <h1>모든 입찰 목록</h1>
        <button onClick={toggleTableVisibility}>
          {isTableVisible ? 'Hide Table' : 'Show Table'}
        </button>
        {isTableVisible && (
          <table className="table">
            <thead>
              <tr>
                <th>입찰 ID</th>
                <th>경매 ID</th>
                <th>입찰자 ID</th>
                <th>입찰금액</th>
                <th>입찰 시간</th>
              </tr>
            </thead>
            <tbody>
              {bids.map(bid => (
                <tr
                  key={bid.id}
                  onClick={() => handleRowClick(bid.auctionDto.id)}
                  style={{ cursor: 'pointer' }} // 마우스를 올렸을 때 클릭할 수 있는 커서로 변경
                >
                  <td>{bid.id}</td>
                  <td>{bid.auctionDto.id}</td>
                  <td>{bid.userDto.userId}</td>
                  <td>{bid.bidFee}</td>
                  <td>{new Date(bid.bidTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
};

export default CurrentBids;
