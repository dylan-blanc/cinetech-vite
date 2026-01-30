import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SideBar from './components/SideBar';
import Home from './view/Home';
import Search from './view/Search';
import Details from './view/Details';
import Gallerie from './view/Gallerie';
import AuthForm from './components/AA-ConnectForm';
// import Connexion from './view/Connexion';
// import Inscription from './view/Inscription';
import './index.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
            <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Header onToggleSidebar={toggleSidebar} />

                <main className="flex-1 flex">
                    <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />
                    <div className="w-full md:w-4/5 p-4">
                        <Routes>
                            <Route path="/" element={<Home />}  />
                            <Route path="/recherche" element={<Search />} />
                            <Route path="/details/:type/:id" element={<Details />} />
                            <Route path="/gallerie/:type/:id" element={<Gallerie />} />
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
