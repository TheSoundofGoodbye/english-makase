import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storage';
import type { DailySentence } from '../services/storage';
import { ContentService } from '../services/contentService';
import type { GeneratedSentenceResponse } from '../services/contentService';
import { TextProcessor } from '../utils/textProcessor';

export const Dashboard: React.FC = () => {
  const hobby = StorageService.getHobby() || '';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyData, setDailyData] = useState<GeneratedSentenceResponse | null>(null);
  const [savedLocally, setSavedLocally] = useState<boolean>(false);
  const [stats, setStats] = useState({ totalWords: 0 });

  useEffect(() => {
    // Determine if today's history is already populated
    const history = StorageService.getHistory();
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysRecord = history.find(h => h.date === todayStr);
    
    if (todaysRecord) {
      setDailyData({
        sentences: todaysRecord.sentences,
        sentenceTranslations: todaysRecord.sentenceTranslations || [],
        translationHighlights: todaysRecord.translationHighlights || [],
        newWords: todaysRecord.newVocabulary
      });
      setSavedLocally(true);
    }
    
    // Set vocabulary count
    setStats({ totalWords: StorageService.getSeenVocabulary().size });
  }, []);

  const handleFetchSentences = async () => {
    setLoading(true);
    setError(null);
    setSavedLocally(false);

    try {
      if (!hobby) throw new Error("관심사를 먼저 설정해야 합니다.");
      const response = await ContentService.generateDailySentences(hobby);
      setDailyData(response);
    } catch (err: any) {
      setError(err.message || "문장을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!dailyData) return;
    const todayStr = new Date().toISOString().split('T')[0];
    
    const record: DailySentence = {
      date: todayStr,
      sentences: dailyData.sentences,
      sentenceTranslations: dailyData.sentenceTranslations,
      translationHighlights: dailyData.translationHighlights,
      newVocabulary: dailyData.newWords
    };

    // Save to daily history log
    StorageService.addDailySentence(record);

    // Only mark the highlighted idiom phrases as "seen"
    // (NOT all words from the full sentence, which would cause over-counting)
    TextProcessor.markWordsAsSeen(dailyData.newWords.map(nw => nw.word));

    setSavedLocally(true);
    setStats({ totalWords: StorageService.getSeenVocabulary().size });
  };

  const handleReset = () => {
    if (window.confirm("정말 모든 학습 기록과 관심사 설정을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const renderSentence = (sentence: string, index: number) => {
    const idiomsToHighlight = dailyData ? dailyData.newWords.map(nw => nw.word) : [];
    const tokens = TextProcessor.highlightPhrases(sentence, idiomsToHighlight);
    const translation = dailyData?.sentenceTranslations?.[index];
    const highlights = dailyData?.translationHighlights || [];

    // Split the Korean translation into segments, highlighting matched phrases
    const renderTranslation = (text: string) => {
      if (!highlights.length) return <>{text}</>;
      // Build a regex that matches any of the highlight phrases
      const escapedPhrases = highlights.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
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

    return (
      <div key={index} style={{ marginBottom: '1.2rem' }}>
        <p style={{ fontSize: '1.2rem', margin: 0, lineHeight: '1.8' }}>
          {tokens.map((token, tId) => 
            token.isHighlighted ? (
              <span key={tId} className="highlight-word" title="새로운 표현!">{token.text}</span>
            ) : (
              <span key={tId}>{token.text}</span>
            )
          )}
        </p>
        {translation && (
          <p style={{ 
            margin: '0.3rem 0 0 0', 
            fontSize: '0.9rem', 
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
  };

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>잉글리시 오마카세</h2>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)' }}>관심사: <strong style={{ color: 'var(--text-primary)' }}>{hobby}</strong></span>
          <span style={{ color: 'var(--text-secondary)' }}>배운 표현: <strong style={{ color: 'var(--text-primary)' }}>{stats.totalWords}</strong>개</span>
          <button onClick={handleReset} style={{ color: '#ef4444', textDecoration: 'underline', fontSize: '0.9rem' }}>초기화</button>
        </div>
      </header>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: 'var(--text-accent)' }}>오늘의 표현</h3>
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

        {!dailyData && !loading && (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <p style={{ fontStyle: 'italic', marginBottom: '1.5rem' }}>아직 오늘의 문장이 준비되지 않았습니다.</p>
            <button className="btn-primary" onClick={handleFetchSentences}>오늘의 문장 받아보기</button>
          </div>
        )}

        {loading && (
           <div style={{ padding: '2rem 0', textAlign: 'center' }}>
             <div className="loader"></div>
             <p style={{ marginTop: '1rem' }}>"{hobby}" 관련 원어민 표현을 준비하고 있습니다...</p>
           </div>
        )}

        {dailyData && !loading && (
          <div className="fade-in">
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
              {dailyData.sentences.map((s, idx) => renderSentence(s, idx))}
            </div>

            <h4>표현 및 단어 상세:</h4>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {dailyData.newWords.map((nw, idx) => (
                <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--text-accent)' }}>
                  <strong style={{ color: 'var(--text-accent)', fontSize: '1.1rem' }}>{nw.word}</strong>
                  <p style={{ margin: '0.5rem 0', color: 'var(--text-primary)' }}>{nw.meaning}</p>
                  <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.9rem' }}>"{nw.context}"</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              {!savedLocally && (
                <button className="btn-primary" style={{ background: 'var(--success-color)' }} onClick={handleSaveToHistory}>학습 기록에 저장하기 ✅</button>
              )}
              {savedLocally && (
                <span style={{ color: 'var(--success-color)', padding: '0.75rem', fontWeight: 'bold' }}>단어장에 추가되었습니다!</span>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
