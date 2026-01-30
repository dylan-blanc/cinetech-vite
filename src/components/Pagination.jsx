import { useState } from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
    // Générer les numéros de page à afficher
    const getPageNumbers = () => {
        const pages = [];
        
        // Toujours afficher la première page
        pages.push(1);
        
        // Pages autour de la page actuelle
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);
        
        // Ajouter "..." si nécessaire avant les pages centrales
        if (startPage > 2) {
            pages.push('...');
        }
        
        // Pages centrales
        for (let i = startPage; i <= endPage; i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }
        
        // Ajouter "..." si nécessaire après les pages centrales
        if (endPage < totalPages - 1) {
            pages.push('...');
        }
        
        // Toujours afficher la dernière page
        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }
        
        return pages;
    };

    const handlePageClick = (page) => {
        if (page !== '...' && page !== currentPage) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleFirst = () => {
        if (currentPage !== 1) {
            onPageChange(1);
        }
    };

    const handleLast = () => {
        if (currentPage !== totalPages) {
            onPageChange(totalPages);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center mt-8">
            <div 
                className="flex items-center rounded-md overflow-hidden"
                style={{ backgroundColor: '#282129' }}
            >
                {/* Bouton première page */}
                <button
                    onClick={handleFirst}
                    disabled={currentPage === 1}
                    className="px-4 py-3 text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ borderRight: '1px solid #3D363E' }}
                    aria-label="Première page"
                >
                    <span className="text-lg font-bold">&laquo;</span>
                </button>

                {/* Numéros de page */}
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageClick(page)}
                        disabled={page === '...'}
                        className={`px-4 py-3 min-w-[48px] text-white transition-colors ${
                            page === currentPage 
                                ? 'bg-white/20 font-bold' 
                                : page === '...' 
                                    ? 'cursor-default' 
                                    : 'hover:bg-white/10'
                        }`}
                        style={{ borderRight: '1px solid #3D363E' }}
                    >
                        {page}
                    </button>
                ))}

                {/* Bouton dernière page */}
                <button
                    onClick={handleLast}
                    disabled={currentPage === totalPages}
                    className="px-4 py-3 text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Dernière page"
                >
                    <span className="text-lg font-bold">&raquo;</span>
                </button>
            </div>
        </div>
    );
}

export default Pagination;
