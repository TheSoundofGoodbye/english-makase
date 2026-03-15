import React from 'react';
import { StorageService } from '../services/storage';

interface Props {
  onBack: () => void;
}

export const History: React.FC<Props> = ({ onBack }) => {
  const history = StorageService.getHistory();

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>학습 기록 📚</h2>
        <button onClick={onBack} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
           ← 대시보드로 돌아가기
        </button>
      </header>

      {history.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>아직 저장된 문장이 없습니다.</p>
          <p>대시보드에서 문장을 생성하고 저장하여 학습 기록을 만들어보세요!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {history.map((record, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-accent)' }}>{record.date}</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>새로운 표현 {record.newVocabulary.length}개</span>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                {record.sentences.map((sentence, sIdx) => (
                   <p key={sIdx} style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{sentence}</p>
                ))}
              </div>

              <div>
                {record.newVocabulary.map((nw, vIdx) => (
                  <div key={vIdx} style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--text-accent)' }}>{nw.word}</strong>: {nw.meaning}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
