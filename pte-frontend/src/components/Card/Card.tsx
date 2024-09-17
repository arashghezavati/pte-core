import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  footer?: React.ReactNode;
  timer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, title, className, footer, timer }) => {
  return (
    <div className={`card ${className}`}>
      {title && <h2 className="card-title">{title}</h2>}
      {timer && <div className="card-timer">{timer}</div>}
      <div className="card-content">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
