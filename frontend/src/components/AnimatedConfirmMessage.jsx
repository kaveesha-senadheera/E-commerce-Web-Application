import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function AnimatedConfirmMessage({ message, isVisible, onClose, orderData }) {
  console.log('AnimatedConfirmMessage rendered:', { message, isVisible });
  if (!isVisible) return null;

  // Check if this is a deletion success message
  const isDeletionMessage = message && message.toLowerCase().includes('deleted');
  // Check for specific deletion message
  const isSpecificDeleteMessage = message && message.includes('Order deleted successfully! 🗑️');

  const generateOrderPDF = () => {
    if (!orderData) return;
    
    const doc = new jsPDF();
    
    // Add title without logo for now (logo loading issues)
    doc.setFontSize(20);
    doc.setTextColor(78, 205, 196);
    doc.text('EFarmer - Order Confirmation', 105, 20, { align: 'center' });
    
    // Add order details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Order ID: ${orderData.orderId || 'N/A'}`, 20, 40);
    doc.text(`Order Date: ${new Date(orderData.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Status: ${orderData.status || 'PENDING'}`, 20, 60);
    
    // Customer details table
    const customerData = [
      ['Field', 'Information'],
      ['First Name', orderData.firstName || 'N/A'],
      ['Last Name', orderData.lastName || 'N/A'],
      ['Address', orderData.address || 'N/A'],
      ['Province', orderData.province || 'N/A'],
      ['City', orderData.city || 'N/A'],
      ['Postal Code', orderData.postalCode || 'N/A'],
      ['Mobile Number', orderData.mobileNo || 'N/A'],
      ['Payment Method', orderData.paymentMethod || 'N/A']
    ];
    
    doc.autoTable({
      head: [customerData[0]],
      body: customerData.slice(1),
      startY: 80,
      theme: 'grid',
      headStyles: { fillColor: [78, 205, 196] },
      styles: { fontSize: 10 }
    });
    
    // Add footer with EFarmer branding
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for your order!', 105, 280, { align: 'center' });
    doc.text('This is an automatically generated order confirmation.', 105, 285, { align: 'center' });
    doc.text('EFarmer - Your Trusted Agricultural Partner', 105, 290, { align: 'center' });
    
    // Download the PDF
    try {
      doc.save(`Order_${orderData.orderId || 'Confirmation'}.pdf`);
      console.log('PDF downloaded successfully');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('There was an error downloading the PDF. Please try again.');
    }
  };

  return (
    <div className="animated-confirm-overlay">
      <div className={`animated-confirm-container ${isDeletionMessage ? 'delete-success-container' : ''}`}>
        {/* Animated Background */}
        <div className="confirm-bg-animation">
          <div className="confirm-circle confirm-circle-1"></div>
          <div className="confirm-circle confirm-circle-2"></div>
          <div className="confirm-circle confirm-circle-3"></div>
          <div className="confirm-particles">
            <div className="confirm-particle confirm-particle-1">✨</div>
            <div className="confirm-particle confirm-particle-2">⭐</div>
            <div className="confirm-particle confirm-particle-3">✨</div>
            <div className="confirm-particle confirm-particle-4">⭐</div>
            <div className="confirm-particle confirm-particle-5">✨</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="confirm-content">
          {/* Success Icon */}
          <div className={`confirm-success-icon ${isDeletionMessage ? 'delete-success' : ''} ${isSpecificDeleteMessage ? 'specific-delete' : ''}`}>
            <div className="confirm-checkmark-wrapper">
              <div className="confirm-checkmark-circle">
                {isSpecificDeleteMessage ? (
                  <div className="specific-delete-content">
                    <div className="trash-animation">
                      <div className="trash-lid"></div>
                      <div className="trash-body">
                        <div className="trash-line trash-line-1"></div>
                        <div className="trash-line trash-line-2"></div>
                        <div className="trash-line trash-line-3"></div>
                      </div>
                    </div>
                    <div className="delete-success-text">Successfully Deleted!</div>
                    <div className="delete-success-subtitle">Order removed from system</div>
                  </div>
                ) : isDeletionMessage ? (
                  <div className="delete-success-content">
                    <div className="delete-success-emoji">🗑️</div>
                    <div className="delete-success-text">Deleted!</div>
                  </div>
                ) : (
                  <svg className="confirm-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="confirm-checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path className="confirm-checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Message */}
          <h2 className={`confirm-title ${isDeletionMessage ? 'delete-title' : ''} ${isSpecificDeleteMessage ? 'specific-delete-title' : ''}`}>
            {isSpecificDeleteMessage ? 'Order Deleted Successfully!' : isDeletionMessage ? 'Order Deleted!' : 'Success!'}
          </h2>
          <p className={`confirm-message ${isDeletionMessage ? 'delete-message' : ''} ${isSpecificDeleteMessage ? 'specific-delete-message' : ''}`}>{message}</p>

          {/* Action Buttons */}
          <div className="confirm-button-container">
            <button className="confirm-button" onClick={onClose}>
              <span>{isDeletionMessage ? 'Continue' : 'Continue Shopping'}</span>
              <div className="confirm-button-icon">{isDeletionMessage ? '✅' : '🎉'}</div>
            </button>
            
            {orderData && (
              <button className="pdf-button" onClick={generateOrderPDF}>
                <span>Download PDF</span>
                <div className="pdf-button-icon">📄</div>
              </button>
            )}
          </div>

          {/* Auto-close indicator */}
          <div className="confirm-auto-close">
            <div className="confirm-progress-bar">
              <div className="confirm-progress-fill"></div>
            </div>
            <span className="confirm-auto-close-text">Auto-closing in 3 seconds...</span>
          </div>
        </div>

        {/* CSS Styles */}
        <style>{`
          .animated-confirm-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            backdrop-filter: blur(10px);
            animation: confirmFadeIn 0.3s ease-out;
          }

          @keyframes confirmFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(10px);
            }
          }

          .animated-confirm-container {
            position: relative;
            background: linear-gradient(135deg, #1a3a52 0%, #0d2818 50%, #1a3a52 100%);
            border-radius: 24px;
            padding: 40px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(78, 205, 196, 0.3);
            overflow: hidden;
            animation: confirmSlideIn 0.5s ease-out;
          }

          .animated-confirm-container.delete-success-container {
            background: linear-gradient(135deg, #2a1a3a 0%, #1a0d18 50%, #2a1a3a 100%);
            border: 2px solid rgba(220, 53, 69, 0.5);
            box-shadow: 0 25px 60px rgba(220, 53, 69, 0.3);
            animation: deleteContainerShake 0.6s ease-out;
          }

          @keyframes deleteContainerShake {
            0%, 100% { transform: translateX(0) scale(1); }
            10% { transform: translateX(-5px) scale(1.02); }
            20% { transform: translateX(5px) scale(1.02); }
            30% { transform: translateX(-3px) scale(1.01); }
            40% { transform: translateX(3px) scale(1.01); }
            50% { transform: translateX(-1px) scale(1); }
            60% { transform: translateX(1px) scale(1); }
            70% { transform: translateX(0) scale(1); }
          }

          @keyframes confirmSlideIn {
            from {
              opacity: 0;
              transform: translateY(-50px) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .confirm-bg-animation {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
          }

          .confirm-circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(78, 205, 196, 0.1);
            animation: confirmFloat 8s ease-in-out infinite;
          }

          .confirm-circle-1 {
            width: 60px;
            height: 60px;
            top: -15px;
            left: -15px;
            animation-delay: 0s;
          }

          .confirm-circle-2 {
            width: 40px;
            height: 40px;
            bottom: -10px;
            right: -10px;
            animation-delay: 2s;
          }

          .confirm-circle-3 {
            width: 30px;
            height: 30px;
            top: 50%;
            right: -8px;
            animation-delay: 4s;
          }

          @keyframes confirmFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-15px) rotate(120deg); }
            66% { transform: translateY(8px) rotate(240deg); }
          }

          .confirm-particles {
            position: absolute;
            width: 100%;
            height: 100%;
          }

          .confirm-particle {
            position: absolute;
            font-size: 16px;
            animation: confirmTwinkle 2s ease-in-out infinite;
          }

          .confirm-particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
          .confirm-particle-2 { top: 15%; right: 15%; animation-delay: 0.5s; }
          .confirm-particle-3 { bottom: 20%; left: 20%; animation-delay: 1s; }
          .confirm-particle-4 { bottom: 15%; right: 10%; animation-delay: 1.5s; }
          .confirm-particle-5 { top: 50%; left: 50%; animation-delay: 0.3s; }

          @keyframes confirmTwinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          .confirm-content {
            position: relative;
            z-index: 2;
            text-align: center;
          }

          .confirm-success-icon {
            margin-bottom: 25px;
          }

          .confirm-checkmark-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .confirm-checkmark-circle {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: confirmPulse 2s ease-in-out infinite;
          }

          @keyframes confirmPulse {
            0%, 100% { 
              transform: scale(1); 
              box-shadow: 0 0 0 0 rgba(78, 205, 196, 0.7); 
            }
            50% { 
              transform: scale(1.05); 
              box-shadow: 0 0 0 20px rgba(78, 205, 196, 0); 
            }
          }

          .confirm-checkmark {
            width: 40px;
            height: 40px;
          }

          .confirm-checkmark-circle {
            stroke-width: 2;
            stroke: #ffffff;
            stroke-dasharray: 166;
            stroke-dashoffset: 166;
            animation: confirmStroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }

          .confirm-checkmark-check {
            stroke-width: 3;
            stroke: #ffffff;
            stroke-dasharray: 48;
            stroke-dashoffset: 48;
            animation: confirmStrokeCheck 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
          }

          @keyframes confirmStroke {
            to {
              stroke-dashoffset: 0;
            }
          }

          @keyframes confirmStrokeCheck {
            to {
              stroke-dashoffset: 0;
            }
          }

          .confirm-title {
            font-size: 32px;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 15px 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            animation: confirmTitleSlide 0.6s ease-out 0.4s both;
          }

          @keyframes confirmTitleSlide {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .confirm-message {
            font-size: 18px;
            color: rgba(255, 255, 255, 0.9);
            margin: 0 0 30px 0;
            line-height: 1.5;
            animation: confirmMessageSlide 0.6s ease-out 0.6s both;
          }

          @keyframes confirmMessageSlide {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .confirm-button-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            align-items: center;
            margin: 0 auto 25px;
            animation: confirmButtonSlide 0.6s ease-out 0.8s both;
          }

          .confirm-button {
            background: linear-gradient(135deg, #4ecdc4, #44a08d);
            color: white;
            border: none;
            border-radius: 16px;
            padding: 15px 30px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            max-width: 250px;
            position: relative;
            overflow: hidden;
          }

          .delete-success-container .confirm-button {
            background: linear-gradient(135deg, #dc3545, #c82333);
            border: 2px solid rgba(255, 255, 255, 0.3);
            animation: deleteButtonPulse 2s ease-in-out infinite;
          }

          @keyframes deleteButtonPulse {
            0%, 100% {
              box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
            }
            50% {
              box-shadow: 0 8px 25px rgba(220, 53, 69, 0.6);
            }
          }

          .pdf-button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            border-radius: 16px;
            padding: 15px 30px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            max-width: 250px;
            position: relative;
            overflow: hidden;
          }

          @keyframes confirmButtonSlide {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .confirm-button:hover,
          .pdf-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(78, 205, 196, 0.4);
          }

          .pdf-button:hover {
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          }

          .confirm-button::before,
          .pdf-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s ease;
          }

          .confirm-button:hover::before,
          .pdf-button:hover::before {
            left: 100%;
          }

          .confirm-button-icon,
          .pdf-button-icon {
            font-size: 20px;
            animation: confirmIconBounce 1s ease-in-out infinite;
          }

          @keyframes confirmIconBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }

          .confirm-auto-close {
            margin-top: 20px;
            animation: confirmAutoCloseSlide 0.6s ease-out 1s both;
          }

          @keyframes confirmAutoCloseSlide {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .confirm-progress-bar {
            width: 100%;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
            margin-bottom: 8px;
          }

          .confirm-progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4ecdc4, #44a08d);
            border-radius: 2px;
            animation: confirmProgress 3s linear forwards;
          }

          @keyframes confirmProgress {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          /* Delete Success Specific Styles */
          .confirm-success-icon.delete-success .confirm-checkmark-circle {
            background: linear-gradient(135deg, #dc3545, #c82333);
            border: 3px solid rgba(220, 53, 69, 0.3);
          }

          .delete-success-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: white;
          }

          .delete-success-emoji {
            font-size: 32px;
            animation: deleteSuccessShake 0.5s ease-in-out;
          }

          .delete-success-text {
            font-size: 14px;
            font-weight: bold;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          @keyframes deleteSuccessShake {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-8px) rotate(-10deg); }
            50% { transform: translateX(8px) rotate(10deg); }
            75% { transform: translateX(-4px) rotate(-5deg); }
          }

          .confirm-title.delete-title {
            color: #dc3545;
            text-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
          }

          .confirm-message.delete-message {
            color: rgba(220, 53, 69, 0.9);
            font-weight: 500;
          }

          .confirm-success-icon.delete-success {
            animation: deleteSuccessPulse 2s ease-in-out infinite;
          }

          @keyframes deleteSuccessPulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          /* Enhanced particles for delete success */
          .confirm-success-icon.delete-success ~ .confirm-bg-animation .confirm-particle {
            animation-duration: 1.5s;
          }

          .confirm-success-icon.delete-success ~ .confirm-bg-animation .confirm-particle-1,
          .confirm-success-icon.delete-success ~ .confirm-bg-animation .confirm-particle-3,
          .confirm-success-icon.delete-success ~ .confirm-bg-animation .confirm-particle-5 {
            content: '🗑️';
            color: #dc3545;
          }

          .confirm-success-icon.delete-success ~ .confirm-bg-animation .confirm-particle-2,
          .confirm-success-icon.delete-success ~ .confirm-bg-animation .confirm-particle-4 {
            content: '❌';
            color: #dc3545;
          }

          /* Specific Delete Message Animations */
          .confirm-success-icon.specific-delete .confirm-checkmark-circle {
            background: linear-gradient(135deg, #dc3545, #c82333, #a71e2a);
            border: 4px solid rgba(220, 53, 69, 0.4);
            box-shadow: 0 0 30px rgba(220, 53, 69, 0.6);
            animation: specificDeleteGlow 2s ease-in-out infinite;
          }

          @keyframes specificDeleteGlow {
            0%, 100% {
              box-shadow: 0 0 30px rgba(220, 53, 69, 0.6);
            }
            50% {
              box-shadow: 0 0 50px rgba(220, 53, 69, 0.8);
            }
          }

          .specific-delete-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: white;
          }

          .trash-animation {
            position: relative;
            width: 60px;
            height: 60px;
            animation: trashFloat 3s ease-in-out infinite;
          }

          @keyframes trashFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-10px) rotate(-5deg);
            }
            50% {
              transform: translateY(-5px) rotate(5deg);
            }
            75% {
              transform: translateY(-15px) rotate(-3deg);
            }
          }

          .trash-lid {
            position: absolute;
            top: 5px;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 8px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 4px;
            animation: lidBounce 2s ease-in-out infinite;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          @keyframes lidBounce {
            0%, 100% {
              transform: translateX(-50%) rotate(0deg);
            }
            25% {
              transform: translateX(-50%) rotate(-10deg);
            }
            50% {
              transform: translateX(-50%) rotate(10deg);
            }
            75% {
              transform: translateX(-50%) rotate(-5deg);
            }
          }

          .trash-body {
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
            height: 35px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 4px 4px 8px 8px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }

          .trash-line {
            position: absolute;
            width: 100%;
            height: 2px;
            background: rgba(220, 53, 69, 0.6);
            left: 0;
            animation: trashLines 1.5s ease-in-out infinite;
          }

          .trash-line-1 {
            top: 8px;
            animation-delay: 0s;
          }

          .trash-line-2 {
            top: 16px;
            animation-delay: 0.3s;
          }

          .trash-line-3 {
            top: 24px;
            animation-delay: 0.6s;
          }

          @keyframes trashLines {
            0%, 100% {
              opacity: 0.3;
              transform: scaleX(0.8);
            }
            50% {
              opacity: 1;
              transform: scaleX(1);
            }
          }

          .delete-success-text {
            font-size: 16px;
            font-weight: bold;
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            animation: textGlow 2s ease-in-out infinite;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
          }

          .delete-success-subtitle {
            font-size: 11px;
            margin-top: 5px;
            opacity: 0.9;
            font-style: italic;
            animation: subtitleFade 3s ease-in-out infinite;
          }

          @keyframes textGlow {
            0%, 100% {
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
            }
            50% {
              text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            }
          }

          @keyframes subtitleFade {
            0%, 100% {
              opacity: 0.7;
            }
            50% {
              opacity: 1;
            }
          }

          .confirm-title.specific-delete-title {
            color: #dc3545;
            text-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
            animation: titlePulse 2s ease-in-out infinite;
            font-size: 32px;
          }

          .confirm-message.specific-delete-message {
            color: rgba(220, 53, 69, 0.9);
            font-weight: 500;
            font-size: 16px;
            animation: messageGlow 3s ease-in-out infinite;
          }

          @keyframes titlePulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }

          @keyframes messageGlow {
            0%, 100% {
              text-shadow: 0 0 5px rgba(220, 53, 69, 0.3);
            }
            50% {
              text-shadow: 0 0 15px rgba(220, 53, 69, 0.6);
            }
          }

          /* Enhanced particles for specific delete */
          .confirm-success-icon.specific-delete ~ .confirm-bg-animation .confirm-particle {
            animation-duration: 1s;
            font-size: 20px;
          }

          .confirm-success-icon.specific-delete ~ .confirm-bg-animation .confirm-particle-1,
          .confirm-success-icon.specific-delete ~ .confirm-bg-animation .confirm-particle-3,
          .confirm-success-icon.specific-delete ~ .confirm-bg-animation .confirm-particle-5 {
            content: '🗑️';
            color: #dc3545;
            animation: trashParticleFloat 2s ease-in-out infinite;
          }

          .confirm-success-icon.specific-delete ~ .confirm-bg-animation .confirm-particle-2,
          .confirm-success-icon.specific-delete ~ .confirm-bg-animation .confirm-particle-4 {
            content: '💥';
            color: #ff6b6b;
            animation: explosionParticle 1.5s ease-in-out infinite;
          }

          @keyframes trashParticleFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg) scale(1);
            }
            50% {
              transform: translateY(-20px) rotate(180deg) scale(1.2);
            }
          }

          @keyframes explosionParticle {
            0%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.5);
              opacity: 1;
            }
          }

          /* Confetti Animation for Delete Success */
          .delete-success-container .confirm-bg-animation::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            background: 
              radial-gradient(circle at 20% 20%, rgba(220, 53, 69, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
            animation: confettiPulse 3s ease-in-out infinite;
          }

          @keyframes confettiPulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1);
            }
          }

          /* Enhanced Delete Success Icon Glow */
          .delete-success-container .confirm-success-icon::before {
            content: '';
            position: absolute;
            top: -20px;
            left: -20px;
            right: -20px;
            bottom: -20px;
            background: radial-gradient(circle, rgba(220, 53, 69, 0.3) 0%, transparent 70%);
            animation: iconGlowPulse 2s ease-in-out infinite;
            z-index: -1;
          }

          @keyframes iconGlowPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.8;
            }
          }

          /* Floating Debris Animation */
          .delete-success-container .confirm-bg-animation::before {
            content: '🗑️💥❌';
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 24px;
            animation: debrisFall 4s ease-in-out infinite;
            opacity: 0.7;
          }

          @keyframes debrisFall {
            0% {
              transform: translateX(-50%) translateY(-50px) rotate(0deg);
              opacity: 0;
            }
            20% {
              opacity: 0.7;
            }
            80% {
              opacity: 0.7;
            }
            100% {
              transform: translateX(-50%) translateY(400px) rotate(360deg);
              opacity: 0;
            }
          }
              width: 100%;
            }
            to {
              width: 0%;
            }
          }

          .confirm-auto-close-text {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
          }

          @media (max-width: 480px) {
            .animated-confirm-container {
              padding: 30px 20px;
              margin: 20px;
            }

            .confirm-title {
              font-size: 28px;
            }

            .confirm-message {
              font-size: 16px;
            }

            .confirm-button,
            .pdf-button {
              font-size: 16px;
              padding: 12px 24px;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AnimatedConfirmMessage;
