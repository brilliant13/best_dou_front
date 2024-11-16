import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 메시지 생성 페이지 컴포넌트
const MessageGenerationPage = () => {
  const [inputText, setInputText] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState([]); // 선택된 키워드 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  const navigate = useNavigate();

  const keywords = [
    "초대",
    "안내",
    "홍보",
    "안부",
    "명절인사",
    "감사",
    "사과",
    "환영",
  ];

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleGenerateMessage = async () => {
    if (inputText.trim() === '') {
      alert('메시지를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const prompt = `
다음의 키워드와 내용을 바탕으로 적절한 메시지를 생성해 주세요.

키워드: ${selectedKeywords.length > 0 ? selectedKeywords.join(', ') : '없음'}
내용: ${inputText}

생성된 메시지:
`;

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: '당신은 친절한 도우미입니다.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const message = response.data.choices[0].message.content.trim();
      setGeneratedMessage(message);
    } catch (err) {
      console.error(err);
      setError('메시지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseMessage = () => {
    const alertMessage = `선택된 키워드: ${
      selectedKeywords.length > 0 ? selectedKeywords.join(', ') : '없음'
    }\n\n입력된 메시지:\n${generatedMessage}`;

    alert(alertMessage);

    navigate('/', { state: { message: generatedMessage } }); // generatedMessage를 state로 전달
  };

  const toggleKeywordSelection = (keyword) => {
    setSelectedKeywords((prevSelected) =>
      prevSelected.includes(keyword)
        ? prevSelected.filter((k) => k !== keyword) // 이미 선택된 키워드이면 제거
        : [...prevSelected, keyword] // 선택되지 않은 키워드이면 추가
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        {/* 왼쪽 섹션: 발송 목적 및 내용 */}
        <div style={styles.column}>
          <h2>발송 목적 및 내용</h2>
          <textarea
            placeholder="메시지를 입력하세요"
            value={inputText}
            onChange={handleInputChange}
            style={styles.textArea}
          />

          {/* 주요 키워드를 버튼으로 제공하는 영역 */}
          <div style={styles.keywordContainer}>
            <h3>주요 키워드 제시</h3>
            <div style={styles.keywordButtons}>
              {keywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => toggleKeywordSelection(keyword)}
                  style={{
                    ...styles.keywordButton,
                    backgroundColor: selectedKeywords.includes(keyword) ? '#b3c7ff' : '#e1e5f2', // 선택 시 색상 변화
                  }}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          {/* 메시지 생성 버튼 */}
          <button
            onClick={handleGenerateMessage}
            style={styles.generateButton}
            disabled={isLoading}
          >
            {isLoading ? '생성 중...' : '메시지 생성'}
          </button>

          {/* 에러 메시지 표시 */}
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        {/* 오른쪽 섹션: 생성 결과 */}
        <div style={styles.column}>
          <h2>생성 결과</h2>
          <textarea
            style={styles.textArea}
            placeholder="결과"
            value={generatedMessage}
            readOnly
          />
          {/* 메시지 사용 버튼 */}
          <button
            onClick={handleUseMessage}
            style={{
              ...styles.useButton,
              backgroundColor: generatedMessage ? '#b3c7ff' : '#ccc',
              cursor: generatedMessage ? 'pointer' : 'not-allowed',
            }}
            disabled={!generatedMessage}
          >
            메시지 사용
          </button>
        </div>
      </div>
    </div>
  );
};

// 스타일 객체 정의
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '900px',
    marginBottom: '20px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '45%',
  },
  textArea: {
    width: '100%',
    height: '150px',
    marginTop: '10px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    resize: 'vertical',
  },
  keywordContainer: {
    marginTop: '20px',
  },
  keywordButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '10px',
  },
  keywordButton: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
  },
  generateButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#b3c7ff',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
  },
  useButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#b3c7ff',
    border: 'none',
    borderRadius: '8px',
    alignSelf: 'center',
    marginTop: '20px',
    transition: 'background-color 0.3s',
  },
  errorText: {
    color: 'red',
    marginTop: '10px',
  },
};

export default MessageGenerationPage;
