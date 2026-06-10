import React from 'react';
import './ScoreControl.css';

export default function ScoreControl({ value, onChange, disabled = false, label = 'Tore' }) {
  const decrement = () => {
    if (value > 0) onChange(value - 1);
  };

  const increment = () => {
    if (value < 9) onChange(value + 1);
  };

  return (
    <div className={`score-control ${disabled ? 'score-control--disabled' : ''}`}>
      <button
        className="score-control__btn score-control__btn--minus"
        onClick={decrement}
        disabled={disabled || value <= 0}
        aria-label={`${label} verringern`}
        type="button"
      >
        −
      </button>
      <span className="score-control__value" aria-live="polite" aria-label={`${label}: ${value}`}>
        {value}
      </span>
      <button
        className="score-control__btn score-control__btn--plus"
        onClick={increment}
        disabled={disabled || value >= 9}
        aria-label={`${label} erhöhen`}
        type="button"
      >
        +
      </button>
    </div>
  );
}
