import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Form } from 'react-bootstrap';

const BoardDetail = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);  // 수정 모드 상태
  const [editedBoard, setEditedBoard] = useState({}); // 수정된 게시글 상태
  const [file, setFile] = useState(null);             // 이미지 파일 상태
  const navigate = useNavigate();

  // 게시글 및 댓글 목록을 가져오는 함수
  const fetchBoardAndComments = async () => {
    try {
      const boardResponse = await axios.get(`http://localhost:8080/api/board/${id}`);
      setBoard(boardResponse.data);
      
      const commentsResponse = await axios.get(`http://localhost:8080/api/comment`, {
        params: { id }
      });
      setComments(commentsResponse.data);
      console.log(commentsResponse.data);
    } catch (error) {
      console.error("There was an error fetching the board or comments!", error);
    }
  };

  useEffect(() => {
    fetchBoardAndComments();
  }, [id]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('Authorization'); // 토큰 가져오기
      const response = await axios.post(
        `http://localhost:8080/api/comment`,
        { contents: comment }, // 요청 본문
        { 
          params: { id }, // 쿼리 매개변수
          headers: {
            'Authorization': token, // 인증 헤더
          },
        }
      );
      
      // 성공 응답 처리
      alert(`댓글이 성공적으로 작성되었습니다: ${response.data.contents}`); // 서버에서 반환한 댓글 내용 표시
  
      // 댓글 작성 후 댓글 목록 새로고침
      fetchBoardAndComments(); // 게시글 및 댓글 목록을 다시 가져옵니다
      setComment('');
    } catch (error) {
      // 에러 상태 코드에 따라 메시지 처리
      if (error.response) {
        // 서버에서 응답이 있었을 경우
        alert(`에러 발생: ${error.response.data}`); // 서버에서 반환한 에러 메시지 표시
      } else if (error.request) {
        // 요청이 보내졌지만 응답이 없었을 경우
        alert("서버로부터 응답을 받지 못했습니다.");
      } else {
        // 오류를 발생시킨 요청 설정에서 문제가 있었던 경우
        alert("댓글 작성 중 오류가 발생했습니다.");
      }
      console.error("There was an error creating the comment!", error);
    }
  };
  

  const handleCommentDelete = async (commentId) => {
    try {
      const token = localStorage.getItem('Authorization'); // 토큰 가져오기
      const response = await axios.delete(`http://localhost:8080/api/comment/${commentId}`, {
        headers: {
          'Authorization': token, // 인증 헤더
        },
      });
  
      // 성공 응답 처리
      alert(response.data); // 서버에서 반환한 성공 메시지 표시
  
      // 댓글 삭제 후 댓글 목록 새로고침
      fetchBoardAndComments(); // 게시글 및 댓글 목록을 다시 가져옵니다
    } catch (error) {
      // 에러 상태 코드에 따라 메시지 처리
      if (error.response) {
        // 서버에서 응답이 있었을 경우
        alert(`에러 발생: ${error.response.data}`); // 서버에서 반환한 에러 메시지 표시
      } else if (error.request) {
        // 요청이 보내졌지만 응답이 없었을 경우
        alert("서버로부터 응답을 받지 못했습니다.");
      } else {
        // 오류를 발생시킨 요청 설정에서 문제가 있었던 경우
        alert("댓글 삭제 중 오류가 발생했습니다.");
      }
      console.error("There was an error deleting the comment!", error);
    }
  };
  

  const handleBoardDelete = async () => {
    try {
      const token = localStorage.getItem('Authorization'); // 토큰 가져오기
      await axios.delete(`http://localhost:8080/api/board/${id}`, {
        headers: {
          'Authorization': token, // 인증 헤더
        },
      });
  
      // 게시글 삭제 후 게시글 목록으로 이동
      navigate('/board/list');
    } catch (error) {
      console.error("There was an error deleting the board!", error);
    }
  };

  const handleEditClick = async () => {
    const token = localStorage.getItem('Authorization');

    try {
      // 서버로 현재 게시글의 ID를 전송하여 사용자 권한 확인
      const response = await axios.post(
        'http://localhost:8080/api/checkuser',
        board,
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        // 권한 확인 성공
        setIsEditing(true);
        setEditedBoard(board); // 현재 게시글 데이터를 수정 상태로 설정
      } else {
        // 권한 확인 실패
        alert('권한이 없습니다.');
      }
    } catch (error) {
      console.error('게시글 수정 권한 확인 실패:', error);
      alert('권한 확인 중 오류가 발생했습니다.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBoard({
      ...editedBoard,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', editedBoard.title);
    formData.append('contents', editedBoard.contents);
    formData.append('productName', editedBoard.productName);
    formData.append('productCategory', editedBoard.productCategory);
    if (file) {
      formData.append('file', file);
    }

    try {
      const token = localStorage.getItem('Authorization');
      await axios.put(`http://localhost:8080/api/board/${id}`, formData, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      // 수정 후 게시글 및 댓글 목록 새로고침
      setIsEditing(false);
      fetchBoardAndComments();
    } catch (error) {
      console.error("There was an error updating the board!", error);
    }
  };

  if (!board) {
    return <p>Loading...</p>;
  }

  return (
    <Container className="w-75 d-flex flex-column justify-content-center mb-4 mt-4">
      <div className="w-100 text-left border border-dark p-4 d-flex flex-column">
        {isEditing ? (
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="title">
              <Form.Label>제목</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editedBoard.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="contents" className="mt-2">
              <Form.Label>내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="contents"
                value={editedBoard.contents}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="productName" className="mt-2">
              <Form.Label>상품명</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={editedBoard.productName}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="productCategory" className="mt-2">
              <Form.Label>카테고리</Form.Label>
              <Form.Control
                type="text"
                name="productCategory"
                value={editedBoard.productCategory}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="file" className="mt-2">
              <Form.Label>이미지 파일</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">수정 완료</Button>
            <Button variant="secondary" className="mt-3 ms-2" onClick={() => setIsEditing(false)}>취소</Button>
          </Form>
        ) : (
          <>
            <h2 className="text-center  ">{board.title}</h2>
            <div className="d-flex ">
              <div className="w-50 border-end border-dark border-2 p-2 d-flex flex-column justify-content-center align-items-center ">
                {board.imagePath && (
                  <img
                    src={`http://localhost:8080/images/${board.imagePath}`}
                    alt="게시글 이미지"
                    style={{ width: '300px', height: 'auto' }}
                  />
                )}
                <p>{board.productName}</p>
              </div>

              <div className="w-50 p-2 border-start border-dark border-2 ">
                <p>게시글 ID: {board.id}</p>
                <p>상품 카테고리: {board.productCategory}</p>
                <p>작성시간: {new Date(board.createTime).toLocaleString()}</p>
                <p>작성자: {board.userDto.userId}</p>
                <p>내용</p>
                <p>{board.contents}</p>
              </div>
            </div>

            {/* 댓글 목록 표시 */}
            <div className="mt-4">
              <h4>댓글</h4>
              {comments.length > 0 ? (
                <ul style={{ listStyleType: 'none', padding: 0, backgroundColor: '#ffffff' }}>
                  {comments.map((comment) => (
                    <li key={comment.id} style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                      <p><strong>작성자:</strong> {comment.userDto.userId}</p> {/* 사용자 ID 표시 */}
                      <p>{comment.contents}</p>
                      <div className="d-flex justify-content-end">
        <Button variant="danger" onClick={() => handleCommentDelete(comment.id)}>삭제</Button>
      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>댓글이 없습니다.</p>
              )}
            </div>

            {/* 댓글 입력 폼 */}
            <Form onSubmit={handleCommentSubmit} className="mt-4">
              <Form.Group controlId="comment">
                <Form.Label>댓글 작성</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="댓글을 입력하세요..."
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" className="mt-2 ">댓글 작성</Button>
              </div>
            </Form>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" className="me-2" onClick={() => navigate('/board/list')}>돌아가기</Button>
              <Button variant="danger" className="me-2" onClick={handleBoardDelete}>게시글 삭제</Button>
              <Button variant="secondary" onClick={handleEditClick}>게시글 수정</Button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default BoardDetail;
