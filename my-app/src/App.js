// import 'bootstrap/dist/css/bootstrap.min.css';
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import BoardDetail from './boarddetail';
// import BoardList from './board';
// import Login from './login';
// import BoardForm from './boardform';

// function App() {
//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/" element={<BoardList />} />
//           <Route path="/board/:id" element={<BoardDetail />} />
//           <Route path='/login' element={<Login/>}/>
//           <Route path='/createboard' element={<BoardForm/>} />




//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile'; // 새로 추가된 컴포넌트
import AuctionForm from './components/createauction';
import AuctionList from './components/auctionlist';
import AuctionDetail from './components/auctiondetail';
import UserEdit from './components/useredit';
import FindAccount from './components/findaccount';
import Header from './header';
import CreateBoardForm from './components/board';
import BoardList from './components/boardlist';
import BoardDetail from './components/boarddetail';
import Home from './components/home';
import Management from './components/management';
import './css/App.css'

const App = () => {
  return (
    <Router>
      <div className="App">
        
      <Header />
      <div className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auction/create" element={<AuctionForm />} />
          <Route path="/auctionlist" element={<AuctionList />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path='/users/edit/:id' element={<UserEdit/>}/>
          <Route path='/user/findaccount' element={<FindAccount/>}/>
          <Route path='/board/create' element={<CreateBoardForm/>}/>
          <Route path='/board/list' element={<BoardList/>}/>
          <Route path='/board/:id' element={<BoardDetail/>}/>
          <Route path='/management' element={<Management/>}/>
        </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;

