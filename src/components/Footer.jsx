import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFigma, faDev, faGithub } from "@fortawesome/free-brands-svg-icons";
import LogoTMDB from "../assets/LogoTMDB.png";

function Footer() {
    return (
        <footer  className="" style={{ backgroundColor: "#282129" }}>
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo TMDB à gauche */}
                    <div className="footer-logo">
                        <a 
                            href="https://www.themoviedb.org/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <img 
                                src={LogoTMDB} 
                                alt="TMDB Logo" 
                                className="h-8 ml-8 cursor-pointer hover:opacity-80 transition-opacity"
                            />
                        </a>
                    </div>
                    
                    {/* Icônes à droite */}
                    <div className="flex gap-3 text-white text-xl">
                        <a 
                            href="https://www.figma.com/design/A2QEl8jYbzYTk2FmIVwkLg/Projet-Ecole-et-perso?node-id=0-1" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-500 transition-colors cursor-pointer text-white"
                        >
                            <FontAwesomeIcon icon={faFigma} />
                        </a>
                        <a 
                            href="https://dylan-blanc.students-laplateforme.io/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-500 transition-colors cursor-pointer text-white"
                        >
                            <FontAwesomeIcon icon={faDev} />
                        </a>
                        <a 
                            href="https://github.com/dylan-blanc" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-500 transition-colors cursor-pointer text-white"
                        >
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;