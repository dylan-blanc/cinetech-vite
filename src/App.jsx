import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import SideBar from './components/SideBar';
import Home from './view/Home';
import './index.css';

function App() {

  return (
    <>
            <BrowserRouter>
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 container mx-auto px-0 py-0">
                    <SideBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {/* <Route path="/series" element={<Series />} /> */}
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>

        <h1>test</h1>

    </>
  )
}

export default App
