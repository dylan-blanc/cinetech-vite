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
                        <img 
                            src={LogoTMDB} 
                            alt="TMDB Logo" 
                            className="h-8 ml-8"
                        />
                    </div>
                    
                    {/* Icônes à droite */}
                    <div className="flex gap-3 text-white text-xl">
                        <FontAwesomeIcon icon={faFigma} />
                        <FontAwesomeIcon icon={faDev} />
                        <FontAwesomeIcon icon={faGithub} />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;