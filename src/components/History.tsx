import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { TextProcessor } from '../utils/textProcessor';

export const History: React.FC = () => {
  const history = StorageService.getHistory();
  // Track which items are expanded (collapsed by default)
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggleExpanded = (idx: number) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const renderSentences = (record: any) => {
    const highlights: string[] = record.translationHighlights || [];
    const translations: string[] = record.sentenceTranslations || [];
    const idioms: string[] = (record.newVocabulary || []).map((nw: any) => nw.word);

    const renderTranslation = (text: string) => {
      if (!highlights.length) return <>{text}</>;
      const escapedPhrases = highlights.map((p: string) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const regex = new RegExp(`(${escapedPhrases.join('|')})`, 'g');
      const parts = text.split(regex);
      return (
        <>
          {parts.map((part, i) =>
            highlights.includes(part) ? (
              <strong key={i} style={{ color: '#f59e0b', fontWeight: 700, fontStyle: 'normal' }}>{part}</strong>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </>
      );
    };

    return record.sentences.map((sentence: string, sIdx: number) => {
      const tokens = TextProcessor.highlightPhrases(sentence, idioms);
      const translation = translations[sIdx];
      return (
        <div key={sIdx} style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '1.05rem', margin: 0, lineHeight: '1.8', color: 'var(--text-primary)' }}>
            {tokens.map((token, tId) =>
              token.isHighlighted ? (
                <span key={tId} className="highlight-word">{token.text}</span>
              ) : (
                <span key={tId}>{token.text}</span>
              )
            )}
          </p>
          {translation && (
            <p style={{
              margin: '0.3rem 0 0 0',
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              borderLeft: '2px solid var(--glass-border)',
              paddingLeft: '0.75rem'
            }}>
              {renderTranslation(translation)}
            </p>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>학습 기록 📚</h2>
      </header>

      {history.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>아직 저장된 문장이 없습니다.</p>
          <p>대시보드에서 문장을 생성하고 저장하여 학습 기록을 만들어보세요!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((record, idx) => {
            const isOpen = expanded.has(idx);
            return (
              <div key={idx} className="glass-panel" style={{ padding: '0' }}>
                {/* Header — always visible, click to expand */}
                <div
                  onClick={() => toggleExpanded(idx)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem 1.5rem',
                    cursor: 'pointer',
                    userSelect: 'none',
                    borderRadius: '12px',
                  }}
                >
                  <strong style={{ color: 'var(--text-accent)' }}>{record.date}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      새로운 표현 {record.newVocabulary.length}개
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expandable content */}
                {isOpen && (
                  <div style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--glass-border)' }} className="fade-in">
                    {/* Sentences with translations */}
                    <div style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
                      {renderSentences(record)}
                    </div>

                    {/* Vocabulary list */}
                    <div>
                      {record.newVocabulary.map((nw, vIdx) => (
                        <div key={vIdx} style={{ background: 'var(--bg-secondary)', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem', borderLeft: '3px solid var(--text-accent)' }}>
                          <strong style={{ color: 'var(--text-accent)' }}>{nw.word}</strong>
                          <span style={{ color: 'var(--text-secondary)', margin: '0 0.5rem' }}>—</span>
                          <span>{nw.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
