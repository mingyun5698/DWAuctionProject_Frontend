import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/CommonStyles.css'; // Import common styles

const MyAuctionList = () => {
    const [auctionList, setAuctionList] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchAuctionList = async () => {
            const token = localStorage.getItem('Authorization');
            try {
                const response = await axios.get('http://localhost:8080/api/auction/my', {
                    headers: {
                        'Authorization': token
                    }
                });
                setAuctionList(response.data);
                console.log(response.data);
            } catch (e) {
                console.error('error', e);
            }
        };
        fetchAuctionList();
    }, []);

    const handleRowClick = (auctionId) => {
        navigate(`/auction/${auctionId}`);
    };

    return (
        <div className="container">
            <h1>내가 올린 경매</h1>
            {auctionList.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>제목</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctionList.map((auction) => (
                            <tr key={auction.id} onClick={() => handleRowClick(auction.id)} style={{ cursor: 'pointer' }}>
                                <td>{auction.title}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default MyAuctionList;
