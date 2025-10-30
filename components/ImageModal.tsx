import React from 'react';

interface ImageModalProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-white text-4xl font-bold z-20"
                aria-label="Close image view"
            >
                &times;
            </button>
            <div className="relative p-4 w-full h-full flex items-center justify-center">
                {/* Stop propagation to prevent closing the modal when clicking the image itself */}
                <img 
                    src={imageUrl} 
                    alt="Full screen view" 
                    className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

export default ImageModal;