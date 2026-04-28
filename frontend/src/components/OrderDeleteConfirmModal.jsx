import React, { useState } from 'react';

function OrderDeleteConfirmModal({ order, onConfirm, onCancel, isOpen }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
    setTimeout(() => {
      setIsDeleting(false);
      onCancel();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="delete-confirm-overlay">
      <div className="delete-confirm-container">
        {/* Animated Background */}
        <div className="delete-confirm-bg-animation">
          <div className="delete-confirm-circle delete-confirm-circle-1"></div>
          <div className="delete-confirm-circle delete-confirm-circle-2"></div>
          <div className="delete-confirm-circle delete-confirm-circle-3"></div>
          <div className="delete-confirm-particles">
            <div className="delete-confirm-particle delete-confirm-particle-1">⚠️</div>
            <div className="delete-confirm-particle delete-confirm-particle-2">🗑️</div>
            <div className="delete-confirm-particle delete-confirm-particle-3">⚠️</div>
            <div className="delete-confirm-particle delete-confirm-particle-4">🗑️</div>
            <div className="delete-confirm-particle delete-confirm-particle-5">⚠️</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="delete-confirm-content">
          {/* Warning Icon */}
          <div className="delete-confirm-icon-wrapper">
            <div className="delete-confirm-icon">
              🗑️
            </div>
            <div className="delete-confirm-icon-ring"></div>
          </div>

          {/* Title and Question */}
          <h2 className="delete-confirm-title">Delete Order?</h2>
          <p className="delete-confirm-subtitle">
            Are you sure you want to delete order <span className="delete-confirm-order-id">{order.orderId}</span>?
          </p>

          {/* Order Info Card */}
          <div className="delete-confirm-info-card">
            <div className="delete-confirm-info-header">
              <div className="delete-confirm-info-icon">📋</div>
              <div className="delete-confirm-info-title">Order Information</div>
            </div>
            <div className="delete-confirm-info-content">
              <div className="delete-confirm-info-item">
                <span className="delete-confirm-info-label">Customer:</span>
                <span className="delete-confirm-info-value">{order.firstName} {order.lastName}</span>
              </div>
              <div className="delete-confirm-info-item">
                <span className="delete-confirm-info-label">Status:</span>
                <span className="delete-confirm-info-value delete-confirm-status-badge">{order.status || 'PENDING'}</span>
              </div>
              <div className="delete-confirm-info-item">
                <span className="delete-confirm-info-label">Payment:</span>
                <span className="delete-confirm-info-value">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="delete-confirm-warning">
            <div className="delete-confirm-warning-icon">⚠️</div>
            <div className="delete-confirm-warning-text">
              <strong>Warning:</strong> This action cannot be undone. The order will be permanently deleted from the system.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="delete-confirm-actions">
            <button 
              className={`delete-confirm-delete-btn ${isDeleting ? 'deleting' : ''}`}
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="delete-confirm-spinner"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <span>🗑️</span>
                  <span>Yes, Delete Order</span>
                </>
              )}
            </button>
            
            <button 
              className="delete-confirm-cancel-btn"
              onClick={onCancel}
              disabled={isDeleting}
            >
              <span>❌</span>
              <span>Cancel</span>
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button className="delete-confirm-close" onClick={onCancel}>
          ×
        </button>

        {/* CSS Styles */}
        <style>{`
          .delete-confirm-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            backdrop-filter: blur(10px);
            animation: deleteConfirmFadeIn 0.3s ease-out;
          }

          @keyframes deleteConfirmFadeIn {
            from {
              opacity: 0;
              backdrop-filter: blur(0px);
            }
            to {
              opacity: 1;
              backdrop-filter: blur(10px);
            }
          }

          .delete-confirm-container {
            position: relative;
            background: linear-gradient(135deg, #2c1f1f 0%, #1a0f0f 50%, #2c1f1f 100%);
            border-radius: 24px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(220, 53, 69, 0.3);
            overflow: hidden;
            animation: deleteConfirmSlideIn 0.5s ease-out;
          }

          @keyframes deleteConfirmSlideIn {
            from {
              opacity: 0;
              transform: translateY(-50px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .delete-confirm-bg-animation {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
          }

          .delete-confirm-circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(220, 53, 69, 0.1);
            animation: deleteConfirmFloat 8s ease-in-out infinite;
          }

          .delete-confirm-circle-1 {
            width: 60px;
            height: 60px;
            top: -15px;
            left: -15px;
            animation-delay: 0s;
          }

          .delete-confirm-circle-2 {
            width: 40px;
            height: 40px;
            bottom: -10px;
            right: -10px;
            animation-delay: 2s;
          }

          .delete-confirm-circle-3 {
            width: 30px;
            height: 30px;
            top: 50%;
            right: -8px;
            animation-delay: 4s;
          }

          @keyframes deleteConfirmFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-15px) rotate(120deg); }
            66% { transform: translateY(8px) rotate(240deg); }
          }

          .delete-confirm-particles {
            position: absolute;
            width: 100%;
            height: 100%;
          }

          .delete-confirm-particle {
            position: absolute;
            font-size: 16px;
            animation: deleteConfirmTwinkle 2s ease-in-out infinite;
          }

          .delete-confirm-particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
          .delete-confirm-particle-2 { top: 15%; right: 15%; animation-delay: 0.5s; }
          .delete-confirm-particle-3 { bottom: 20%; left: 20%; animation-delay: 1s; }
          .delete-confirm-particle-4 { bottom: 15%; right: 10%; animation-delay: 1.5s; }
          .delete-confirm-particle-5 { top: 50%; left: 50%; animation-delay: 0.3s; }

          @keyframes deleteConfirmTwinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.2); }
          }

          .delete-confirm-content {
            position: relative;
            z-index: 2;
            text-align: center;
          }

          .delete-confirm-icon-wrapper {
            position: relative;
            margin-bottom: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .delete-confirm-icon {
            font-size: 48px;
            position: relative;
            z-index: 2;
            animation: deleteConfirmIconShake 2s ease-in-out infinite;
          }

          @keyframes deleteConfirmIconShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px) rotate(-5deg); }
            75% { transform: translateX(5px) rotate(5deg); }
          }

          .delete-confirm-icon-ring {
            position: absolute;
            width: 80px;
            height: 80px;
            border: 3px solid rgba(220, 53, 69, 0.3);
            border-radius: 50%;
            animation: deleteConfirmRingPulse 2s ease-in-out infinite;
          }

          @keyframes deleteConfirmRingPulse {
            0%, 100% { 
              transform: scale(1); 
              opacity: 0.3;
            }
            50% { 
              transform: scale(1.2); 
              opacity: 0.1;
            }
          }

          .delete-confirm-title {
            font-size: 28px;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 15px 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }

          .delete-confirm-subtitle {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.9);
            margin: 0 0 25px 0;
            line-height: 1.5;
          }

          .delete-confirm-order-id {
            color: #dc3545;
            font-weight: 700;
            background: rgba(220, 53, 69, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
          }

          .delete-confirm-info-card {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(220, 53, 69, 0.3);
            border-radius: 16px;
            padding: 20px;
            margin-bottom: 20px;
            backdrop-filter: blur(10px);
          }

          .delete-confirm-info-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(220, 53, 69, 0.2);
          }

          .delete-confirm-info-icon {
            font-size: 24px;
          }

          .delete-confirm-info-title {
            font-size: 16px;
            font-weight: 600;
            color: #dc3545;
          }

          .delete-confirm-info-content {
            text-align: left;
          }

          .delete-confirm-info-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .delete-confirm-info-label {
            color: rgba(255, 255, 255, 0.7);
          }

          .delete-confirm-info-value {
            color: #ffffff;
            font-weight: 500;
          }

          .delete-confirm-status-badge {
            background: linear-gradient(135deg, #ffc107, #e0a800);
            color: #000;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }

          .delete-confirm-warning {
            background: rgba(255, 193, 7, 0.1);
            border: 1px solid rgba(255, 193, 7, 0.3);
            border-radius: 12px;
            padding: 15px;
            margin-bottom: 20px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
          }

          .delete-confirm-warning-icon {
            font-size: 20px;
            flex-shrink: 0;
          }

          .delete-confirm-warning-text {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
            line-height: 1.4;
          }

          .delete-confirm-actions {
            display: flex;
            gap: 15px;
          }

          .delete-confirm-delete-btn {
            flex: 1;
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 15px 20px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .delete-confirm-delete-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
          }

          .delete-confirm-delete-btn.deleting {
            background: linear-gradient(135deg, #6c757d, #5a6268);
            cursor: not-allowed;
          }

          .delete-confirm-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: deleteConfirmSpin 1s linear infinite;
          }

          @keyframes deleteConfirmSpin {
            to { transform: rotate(360deg); }
          }

          .delete-confirm-cancel-btn {
            flex: 1;
            background: transparent;
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            padding: 15px 20px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .delete-confirm-cancel-btn:hover:not(:disabled) {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

          .delete-confirm-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.7);
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 3;
          }

          .delete-confirm-close:hover {
            color: white;
            transform: scale(1.1);
          }

          @media (max-width: 600px) {
            .delete-confirm-container {
              padding: 30px 20px;
              margin: 20px;
            }

            .delete-confirm-title {
              font-size: 24px;
            }

            .delete-confirm-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default OrderDeleteConfirmModal;
