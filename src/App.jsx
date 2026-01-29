import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SideBar from './components/SideBar';
import Home from './view/Home';
import AuthForm from './components/AA-ConnectForm';
// import Connexion from './view/Connexion';
// import Inscription from './view/Inscription';
import './index.css';

function App() {

  return (
    <>
            <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 flex">
                    <SideBar />
                    <div className="w-4/5 p-4">
                        <Routes>
                            <Route path="/" element={<Home />}  />
                            <Route path="/connexion" element={<AuthForm mode="login" />} />
                            <Route path="/inscription" element={<AuthForm mode="register" />} />
                            {/* <Route path="/series" element={<Series />} /> */}
                        </Routes>
                    </div>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    </>
  )
}

export default App
