import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllSuccessfulBids = () => {
    const [successfulBids, setSuccessfulBids] = useState([]);
    const [error, setError] = useState(null);
    const [isTableVisible, setIsTableVisible] = useState(true); // 테이블의 표시 상태
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllSuccessfulBids = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/allsuccessfulbid');
                setSuccessfulBids(response.data); // API 응답 데이터 설정
            } catch (err) {
                console.error('Error fetching all successful bids:', err);
                setError('Failed to fetch all successful bids');
            }
        };

        fetchAllSuccessfulBids();
    }, []);

    const handleRowClick = (auctionId) => {
        // auctionId로 경로 변경
        navigate(`/auction/${auctionId}`);
    };

    const toggleTableVisibility = () => {
        setIsTableVisible(!isTableVisible);
    };

    return (
        <div className="container">
            <h1>모든 낙찰 목록</h1>
            <button onClick={toggleTableVisibility} style={{ marginBottom: '10px' }}>
                {isTableVisible ? 'Hide Table' : 'Show Table'}
            </button>
            {error && <p>{error}</p>}
            {isTableVisible && (
                <table className="table">
                    <thead>
                        <tr>
                            <th>낙찰 ID</th>
                            <th>경매 ID</th>
                            <th>입찰자 ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {successfulBids.map(successfulBid => (
                            <tr 
                                key={successfulBid.id} 
                                onClick={() => handleRowClick(successfulBid.auctionDto.id)} 
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{successfulBid.id}</td>
                                <td>{successfulBid.auctionDto.id}</td>
                                <td>{successfulBid.userDto.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AllSuccessfulBids;
