import Login from './component/login';
import SingUp from './component/singUp';
import Post from './component/post';
import Error from './component/error';
import Footer from './component/footer';
import Header from './component/header';
import 'bootstrap/dist/css/bootstrap.css';

import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
            <BrowserRouter>
                <Header />

                <Routes>

                    <Route path="*" element={<Error />} />
                    <Route path="/post" element={<Post />} />

                    <Route path="/" element={<Login />} />
                    <Route path="/singUp" element={<SingUp />} />
                  
                </Routes>

                <Footer />
            </BrowserRouter>
            <ToastContainer />
        </>
    );
}

export default App;
