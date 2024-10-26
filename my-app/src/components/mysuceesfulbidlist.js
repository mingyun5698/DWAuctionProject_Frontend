import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/CommonStyles.css'; // Import common styles
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SuccessfulBids = () => {
    const [successfulBids, setSuccessfulBids] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchSuccessfulBids = async () => {
            try {
                const token = localStorage.getItem('Authorization');
                const response = await axios.get('http://localhost:8080/api/successfulbid', {
                    headers: {
                        'Authorization': token,
                    },
                });
                setSuccessfulBids(response.data); // API 응답 데이터 설정
            } catch (err) {
                console.error('Error fetching successful bids:', err);
                setError('Failed to fetch successful bids');
            }
        };

        fetchSuccessfulBids();
    }, []);

    const handleRowClick = (auctionId) => {
        navigate(`/auction/${auctionId}`);
    };

    return (
        <div className="container">
            <h1>나의 낙찰 목록</h1>
            {error && <p>{error}</p>}
            <table className="table">
            <thead>
                <tr>
                    <th>제목</th>
                </tr>
            </thead>
            <tbody>
                {successfulBids.map(bid => (
                    <tr key={bid.id} onClick={() => handleRowClick(bid.auctionDto.id)} style={{ cursor: 'pointer' }}>
                        <td>
                                {bid.auctionDto.title}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    );
};

export default SuccessfulBids;
