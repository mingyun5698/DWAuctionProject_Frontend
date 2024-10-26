import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/CommonStyles.css'; // Import common styles
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const UniqueBids = () => {
    const [bidList, setBidList] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    const token = localStorage.getItem('Authorization');

    useEffect(() => {
        const fetchUniqueBids = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/bidunique', {
                    headers: {
                        'Authorization': token
                    },
                });
                console.log('Fetched bids:', response.data); // 응답 데이터 확인
                setBidList(Array.isArray(response.data) ? response.data : []); // 배열이 아닐 경우 빈 배열로 설정
            } catch (err) {
                console.error('Error fetching unique bids:', err.response ? err.response.data : err.message);
            }
        };

        fetchUniqueBids();
    }, []);

    const handleRowClick = (auctionId) => {
        navigate(`/auction/${auctionId}`);
    };

    return (
        <div className="container">
            <h1>내가 입찰한 경매</h1>
            <table className="table">
            <thead>
                <tr>
                    <th>제목</th>
                </tr>
            </thead>
            <tbody>
                {bidList.map(bid => (
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

export default UniqueBids;
