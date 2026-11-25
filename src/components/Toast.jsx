import React from 'react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div className={`toast-notification ${toast.show ? 'show' : ''}`}>
      <i className="fa-solid fa-circle-check toast-icon"></i>
      <div className="toast-text">
        <strong>{toast.title}</strong>
        <span>{toast.msg}</span>
      </div>
    </div>
  );
}
