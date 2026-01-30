import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import LogoCNT from "../assets/LogoCNT.png";
import SearchBar from "./SearchBar";
import "./Header.css";

function Header({ onToggleSidebar }) {
    const { isAuthentificated, logout } = useAuth();
    const navigate = useNavigate();

    const handleUserClick = (e) => {
        if (isAuthentificated()) {
            e.preventDefault();
            logout();
            navigate('/');
        }
    };

    return (
        <header style={{ backgroundColor: '#282129' }}>
            <div className="container mx-auto px-4 py-2">
                <div className="flex justify-between items-center">
                    {/* Burger Menu - Mobile only (via CSS) */}
                    <button 
                        className="burger-menu"
                        onClick={onToggleSidebar}
                        aria-label="Menu"
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>

                    {/* Logo - lien vers l'accueil */}
                    <Link to="/">
                        <img 
                            src={LogoCNT} 
                            alt="Logo CNT" 
                            className="h-20 md:ml-8 cursor-pointer"
                        />
                    </Link>

                    {/* Barre de recherche */}
                    <SearchBar />

                    {/* Navigation */}
                    <nav className="flex items-center gap-4">
                        {/* Desktop links (via CSS) */}
                        <div className="desktop-nav-links">
                            <Link 
                                to="/connexion" 
                                className="text-gray-300 hover:text-white transition-colors"
                            >
                                Connexion
                            </Link>
                            <Link 
                                to="/inscription" 
                                className="border border-purple-500 text-purple-500 px-4 py-1 rounded hover:bg-purple-500 hover:text-white transition-colors"
                            >
                                Inscription
                            </Link>
                            {isAuthentificated() && (
                                <Link to="/">
                                    <button 
                                        onClick={logout} 
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        Déconnexion
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* User Icon - Mobile only (via CSS) */}
                        <Link 
                            to={isAuthentificated() ? "/" : "/connexion"}
                            onClick={handleUserClick}
                            className={`user-icon-mobile ${isAuthentificated() ? 'authenticated' : 'not-authenticated'}`}
                            aria-label={isAuthentificated() ? "Déconnexion" : "Connexion"}
                        >
                            <FontAwesomeIcon icon={faUser} />
                        </Link>
                    </nav>
                </div>
            </div>
            {/* Ligne en bas du header */}
            <div className="h-1 bg-gray-800"></div>
        </header>
    );
}

export default Header;