import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

const ImageGeneration = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Define navigate
  const [inputText, setInputText] = useState(location.state?.message || "");
  const [keyword] = useState(location.state?.keyword || ""); // 전달받은 키워드
  const [style, setStyle] = useState(null);
  const [subject, setSubject] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [background, setBackground] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const translateCategory = (category, selection) => {
    const translations = {
      style: {
        사실적: "realistic",
        애니메이션: "animation",
        일러스트: "illustration",
        "픽셀 아트": "pixel art",
      },
      subject: {
        청첩장: "invitation",
        "축하 문자": "congratulation message",
        "안부 문자": "greeting message",
        "소식 전달": "announcement",
      },
      emotion: {
        행복한: "happy",
        슬픈: "sad",
        차분한: "calm",
        "에너지 넘치는": "energetic",
      },
      background: {
        실내: "indoor",
        야외: "outdoor",
        도시: "city",
        해변: "beach",
      },
    };
    return translations[category][selection];
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = () => {
    if (!style || !subject || !emotion || !background) {
      alert("모든 카테고리에서 최소한 한 개의 옵션을 선택해야 합니다.");
      return;
    }

    setIsButtonDisabled(true); // 버튼 비활성화

    // 각 카테고리의 선택을 영어로 변환
    const requestData = {
      style: translateCategory("style", style),
      keyword: keyword,
      subject: translateCategory("subject", subject),
      emotion: translateCategory("emotion", emotion),
      background: translateCategory("background", background),
      message: inputText,
    };

    fetch("http://localhost:8080/api/images/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API 요청 실패: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("API 응답 데이터:", data); // API 응답 확인

        if (data.status === "success") {
          // Base64 데이터를 처리
          setGeneratedImage(`data:image/png;base64,${data.imageBase64}`);
          alert(data.message); // 성공 메시지 표시
        } else {
          alert(data.message); // 오류 메시지 표시
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("이미지 생성 중 오류가 발생했습니다. 다시 시도하세요.");
      })
      .finally(() => {
        setTimeout(() => setIsButtonDisabled(false), 10000); // 10초 후 버튼 재활성화
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.column}>
          <h2>발송 목적 및 내용</h2>

          {/* 전달받은 키워드 표시 */}
          {inputText && (
            <div style={styles.selectedKeyword}>
              <h3>추출된 키워드:</h3>
              <p>{keyword}</p>
            </div>
          )}

          <textarea
            placeholder="text 입력"
            value={inputText}
            onChange={handleInputChange}
            style={styles.textArea}
          />

          <div style={styles.keywordContainer}>
            <h3>주요 키워드 제시</h3>
            <div style={styles.keywordButtons}>
              <CategorySelector
                label="스타일"
                options={["사실적", "애니메이션", "일러스트", "픽셀 아트"]}
                selected={style}
                onSelect={setStyle}
              />
              <CategorySelector
                label="목적"
                options={["청첩장", "축하 문자", "안부 문자", "소식 전달"]}
                selected={subject}
                onSelect={setSubject}
              />
              <CategorySelector
                label="감정/분위기"
                options={["행복한", "슬픈", "차분한", "에너지 넘치는"]}
                selected={emotion}
                onSelect={setEmotion}
              />
              <CategorySelector
                label="배경"
                options={["실내", "야외", "도시", "해변"]}
                selected={background}
                onSelect={setBackground}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            style={styles.generateButton}
            disabled={isButtonDisabled}
          >
            {isButtonDisabled ? "생성 중..." : "이미지 생성"}
          </button>
        </div>

        <div style={styles.column}>
          <h2>생성결과</h2>
          <div style={styles.imageDisplay}>
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated"
                style={styles.generatedImage}
              />
            ) : (
              <p>이미지를 생성하세요</p>
            )}
          </div>

          <button
            onClick={() => {
              if (generatedImage) {
                navigate("/", {
                  state: { generatedImage, message: inputText },
                });
              } else {
                alert("이미지를 먼저 생성해주세요.");
              }
            }}
            style={styles.useButton}
          >
            이미지 사용하기
          </button>
        </div>
      </div>
    </div>
  );
};

// 카테고리 선택 버튼 컴포넌트
const CategorySelector = ({ label, options, selected, onSelect }) => (
  <div style={styles.category}>
    <h3 style={styles.categoryLabel}>{label}</h3>
    {options.map((option) => (
      <button
        key={option}
        onClick={() => onSelect(option)}
        style={{
          ...styles.keywordButton,
          backgroundColor: selected === option ? "#007bff" : "#e1e5f2",
          color: selected === option ? "white" : "black",
        }}
      >
        {option}
      </button>
    ))}
  </div>
);

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#F0F4F8",
    minHeight: "100vh",
  },
  row: {
    padding: "17px",
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "1100px", // 기존 900px에서 확장
    gap: "30px", // 박스 간격 조정
    marginBottom: "20px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "550px", // 기존보다 확장된 너비
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "30px",
    gap: "20px", // 요소 간격
  },
  textArea: {
    width: "90%",
    height: "150px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #D1D9E6",
    fontSize: "16px",
    color: "#333",
    backgroundColor: "#F9FAFB",
    outline: "none",
    boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  textAreaFocus: {
    borderColor: "#4A90E2",
    boxShadow: "0 0 8px rgba(74, 144, 226, 0.3)",
  },
  keywordContainer: {
    marginTop: "20px",
  },
  keywordButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px", // 버튼 사이 간격 추가
    marginTop: "10px",
    justifyContent: "flex-start", // 버튼 정렬 조정
  },
  keywordButton: {
    marginLeft: "7px",
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    border: "1px solid #4A90E2",
    borderRadius: "20px",
    backgroundColor: "#FFFFFF",
    color: "#4A90E2",
    transition: "all 0.3s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  keywordButtonActive: {
    backgroundColor: "#4A90E2",
    color: "#FFFFFF",
    boxShadow: "0 4px 8px rgba(74, 144, 226, 0.3)",
  },
  keywordButtonHover: {
    backgroundColor: "#E6F0FF",
    color: "#333",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-2px)", // 부드러운 들림 효과
  },
  generateButton: {
    marginTop: "20px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "#4A90E2",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    transition: "background-color 0.3s, transform 0.2s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  generateButtonHover: {
    backgroundColor: "#357ABD",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(53, 122, 189, 0.3)",
  },
  selectedKeyword: {
    marginBottom: "20px",
    padding: "20px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    border: "1px solid #4A90E2",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "box-shadow 0.3s, transform 0.2s",
  },
  selectedKeywordHover: {
    boxShadow: "0 4px 8px rgba(74, 144, 226, 0.3)",
    transform: "translateY(-2px)",
  },
  keywordTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#4A90E2",
    marginBottom: "8px",
  },
  keywordText: {
    fontSize: "16px",
    color: "#333",
    fontWeight: "500",
  },
  imageDisplay: {
    marginLeft: "61px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #D1D9E6",
    padding: "20px",
    borderRadius: "12px",
    width: "300px",
    height: "300px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  generatedImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "8px",
    objectFit: "contain",
  },
  useButton: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    backgroundColor: "#4A90E2",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "8px",
    alignSelf: "center",
    marginTop: "20px",
    transition: "background-color 0.3s, transform 0.2s",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  useButtonHover: {
    backgroundColor: "#357ABD",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(53, 122, 189, 0.3)",
  },
};

// Replace the keyword box
const SelectedKeywordBox = ({ keyword }) => (
  <div style={styles.selectedKeyword}>
    <h3 style={styles.keywordTitle}>추출된 키워드:</h3>
    <p style={styles.keywordText}>{keyword}</p>
  </div>
);
export default ImageGeneration;
