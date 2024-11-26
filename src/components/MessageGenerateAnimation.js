// components/MessageGenerateAnimation.js
import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import messageAnimationData from '../animations/messageGenerateAnimation.json'; // Lottie 애니메이션 JSON 파일

const MessageGenerateAnimation = () => {
  return (
    <div style={styles.overlay}>
      <Player
        autoplay
        loop
        src={messageAnimationData}
        style={{ 
            backgroundColor: "transparent",  height: '450px', width: '450px' }}
      />
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
};

export default MessageGenerateAnimation;
