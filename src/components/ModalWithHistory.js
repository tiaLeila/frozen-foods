import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';
import { MdHighlightOff } from 'react-icons/md';
import useLocationHash from '../hooks/useLocationHash';


// styled components
const ModalContent = styled(motion.div)`
    position: absolute;
    width: fit-content;

    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
    border-radius: 4px;
`;
const IconClose = styled(MdHighlightOff)`
    position: absolute;

    color: #fff;
    z-index: 9999999999;

`;
const ModalWrapper = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999999;

    background-color: #000000bb;
`; 

/**
 * define the dimensions (height and width) of the children of this Modal with a unit of measure referring to the viewport (vh, vw).
 * For Modal to adjust dinamicaly its dimensions to the dimensions of children.
 * 
 * ex:
 * <Modal>
 *      <Content style={{ width: "80vw", height: "50vh" }} >...</Content>
 * </Modal>
 */
const Modal = ({
    isOpen,
    onRequestClose,
    btnClose = true,
    closeOnEscapeKey = true,
    closeOnClickBackground = true,
    closeOnHistoryBack = true, // close on Browser history back
    locationHash = '#modal',
    children,
}) => {
    
    const modalContentRef = useRef();
    const [ centralizeModalContent, setCentralizeModalContent ] = useState({
        modalContent: {top: '10%'},
        iconClose: {top: '4%'}
    });

    // modal open and close changes the browser history back. 
    const hash = useLocationHash();
    useEffect( () => {
        if(closeOnHistoryBack) {
            if (isOpen) {
                if (!hash.endsWith(locationHash)) {
                    onRequestClose();
                }
            }
        }
    }, [hash, closeOnHistoryBack]);


    //close on escape key
    useEffect( () => {
        if (closeOnEscapeKey) {
            const closeModalOnEscapeKey = event => (event.key === "Escape" ? onRequestClose() : false);
            
            window.addEventListener( 'keydown', closeModalOnEscapeKey );            
            return () => window.removeEventListener( 'keydown', closeModalOnEscapeKey );
        }
        
    }, [closeOnEscapeKey, onRequestClose]);

    //
    useEffect( () => {
        if (isOpen){
            // centralizing the ModalContent component
            setCentralizeModalContent({
                modalContent: {
                    top: `calc( 50vh - ${modalContentRef.current.offsetHeight / 2}px)`,
                    left: `calc(50vw - ${modalContentRef.current.offsetWidth / 2}px)`,
                },
                iconClose: {
                    top: `calc( 50vh - ${modalContentRef.current.offsetHeight / 2}px - 40px)`,
                    right: `calc(50vw - ${modalContentRef.current.offsetWidth / 2}px)`,
                },
            });

            // seting the browser location hash when modal opens.
            if (closeOnHistoryBack) {
                window.location.hash += locationHash;
            }
        } else {
            // seting the browser location hash when modal closes.
            if (hash.endsWith(locationHash)) {
                if (closeOnHistoryBack) {
                    window.history.back();
                }
            }
        }
    }, [isOpen] );

    return (
        <AnimatePresence>
            { isOpen && (
                <ModalWrapper
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >{
                    closeOnClickBackground
                    ?
                        <div
                            style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, }}
                            onClick={onRequestClose}
                        />
                    : false
                    }{
                    btnClose
                    ?
                        <motion.div
                            initial={{ fontSize: "0rem" }}
                            animate={{ fontSize: "2rem", transition: { duration: 0.18} }}
                            exit={{ fontSize: "0rem", transition: { duration: 0.1 } }}
                        >
                            <IconClose onClick={onRequestClose} style={centralizeModalContent.iconClose} />
                        </motion.div>
                    : false
                    }

                    <ModalContent
                        initial={{ scale: 0, }}
                        animate={{ scale: 1, }}
                        exit={{ scale: 0, opacity: 0, borderRadius: "20%", transition: { duration: 0.15 } }}

                        ref={modalContentRef}
                        style={centralizeModalContent.modalContent}
                        
                    >{children}</ModalContent>

                </ModalWrapper>
            )}
        </AnimatePresence>
    )
}

export default Modal;