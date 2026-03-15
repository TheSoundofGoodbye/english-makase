import React, { useState } from 'react';
import { StorageService } from '../services/storage';

interface Props {
  onComplete: () => void;
}

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [hobby, setHobby] = useState('');
  const [error, setError] = useState('');

  const categories = [
    "일상 (Daily Life)",
    "비즈니스 (Business)",
    "여행 (Travel)",
    "스포츠 및 취미 (Sports & Hobbies)"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hobby) {
      setError('관심사를 하나 선택해주세요.');
      return;
    }
    
    StorageService.setHobby(hobby);
    onComplete();
  };

  return (
    <div className="glass-panel fade-in" style={{ textAlign: 'center', marginTop: '10vh' }}>
      <h1>잉글리시 오마카세 🍣</h1>
      <p style={{ fontSize: '1.2rem', margin: '1.5rem 0' }}>
        관심사를 통해 영어를 쉽고 재밌게 배워보세요.
        <br/>
        매일 새로운 원어민 표현을 오마카세로 대접해 드립니다.
      </p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div style={{ marginBottom: '1rem', textAlign: 'left', color: 'var(--text-secondary)' }}>
          <label>관심있는 카테고리를 선택하세요:</label>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {categories.map((cat) => (
            <button 
              key={cat}
              type="button"
              onClick={() => {
                setHobby(cat);
                setError('');
              }}
              style={{
                padding: '1rem',
                border: hobby === cat ? '2px solid var(--text-accent)' : '2px solid var(--glass-border)',
                background: hobby === cat ? 'rgba(255,107,107,0.1)' : 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: hobby === cat ? 'bold' : 'normal'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'left', fontSize: '0.9rem' }}>{error}</div>}
        
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          학습 시작하기
        </button>
      </form>
    </div>
  );
};
