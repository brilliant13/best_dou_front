import React, { useState } from "react";
import axios from "axios";

const PersonalizationModal = ({
  selectedContacts,
  closeModal,
  convertedTexts,
  setConvertedTexts,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState("기본 말투로"); // 선택된 톤 상태

  const currentContact = selectedContacts[currentIndex];

  // 톤 선택 버튼을 렌더링하기 위한 톤 목록
  const tones = [
    { label: "친근한 말투", instruction: "친근하고 다정한 말투로" },
    { label: "격식있는 말투", instruction: "격식 있는 말투로" },
    { label: "유쾌한 말투", instruction: "유쾌하고 밝은 말투로" },
    { label: "정중한 말투", instruction: "정중하고 공손한 말투로" },
    { label: "친구 말투", instruction: "친구한테 하는 말투로" },
    { label: "힙합 말투", instruction: "힙합하는 사람 말투로" },
    { label: "여자친구 말투", instruction: "여자친구한테 하는 말투로" },
    { label: "오바마 말투", instruction: "오바마같은 말투로" },
    { label: "아재 말투", instruction: "아재같은 말투로" },
    { label: "mz 말투", instruction: "진짜 mz세대같은 말투로" },
    { label: "초딩 말투", instruction: "초등학생같은 말투로" },
  ];

  // handleToneSelection 함수 추가
  const handleToneSelection = (tone) => {
    setSelectedTone(tone); // 선택된 톤 상태 업데이트
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, selectedContacts.length - 1)
    );
  };

  const handleConvert = async () => {
    const textToConvert = convertedTexts[currentContact.id] || "";
    if (!textToConvert) {
      alert("변환할 텍스트를 입력하세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
            {
              role: "user",
              content: `Please rewrite the following message in a tone that is ${selectedTone}. Original message: "${textToConvert}".`,
            },
          ],
          max_tokens: 500,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      //ContactList의 convertedTexts값 변경
      setConvertedTexts((prev) => ({
        ...prev,
        [currentContact.id]: response.data.choices[0].message.content.trim(),
      }));
    } catch (error) {
      console.error(
        "API 호출 오류:",
        error.response ? error.response.data : error.message
      );
      alert("텍스트 변환에 실패했습니다. 다시 시도해주세요.");
    }
    setLoading(false);
  };

  const handleTextChange = (e) => {
    const { value } = e.target;
    setConvertedTexts((prev) => ({
      ...prev,
      [currentContact.id]: value,
    }));
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2 style={styles.title}>텍스트 개인 맞춤화</h2>

        {currentContact && (
          <form style={styles.form}>
            <div style={styles.inputGroup}>
              <label>이름:</label>
              <input
                type="text"
                value={currentContact.name}
                readOnly
                style={styles.inputField}
              />
            </div>
            <div style={styles.inputGroup}>
              <label>태그:</label>
              <input
                type="text"
                value={currentContact.tag}
                readOnly
                style={styles.inputField}
              />
            </div>

            <div style={styles.toneSelection}>
              <label>어조 선택:</label>
              <div style={styles.toneButtons}>
                {tones.map((tone) => (
                  <button
                    key={tone.label}
                    type="button"
                    style={{
                      ...styles.toneButton,
                      backgroundColor:
                        selectedTone === tone.instruction ? "#007bff" : "#ccc",
                      color:
                        selectedTone === tone.instruction ? "white" : "black",
                    }}
                    onClick={() => handleToneSelection(tone.instruction)}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.convertSection}>
              <span style={styles.convertLabel}>텍스트 변환</span>
              <button
                type="button"
                style={styles.convertButton}
                onClick={handleConvert}
                disabled={loading}
              >
                {loading ? "변환 중..." : "변환"}
              </button>
            </div>

            <textarea
              style={styles.textArea}
              value={convertedTexts[currentContact.id] || ""}
              onChange={handleTextChange}
              placeholder="여기에 텍스트가 표시됩니다."
            />
          </form>
        )}

        <div style={styles.pagination}>
          <button onClick={() => setCurrentIndex(0)} style={styles.navButton}>
            처음
          </button>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={styles.navButton}
          >
            이전
          </button>
          <span style={styles.pageInfo}>
            {currentIndex + 1} / {selectedContacts.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === selectedContacts.length - 1}
            style={styles.navButton}
          >
            다음
          </button>
          <button
            onClick={() => setCurrentIndex(selectedContacts.length - 1)}
            style={styles.navButton}
          >
            끝
          </button>
        </div>

        <div style={styles.buttonGroup}>
          <button onClick={closeModal} style={styles.closeButton}>
            닫기
          </button>
          <button onClick={onComplete} style={styles.completeButton}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "600px", // 모달창 너비를 더 넓게 설정
    height: "700px", // 모달창 높이를 더 크게 설정
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1001,
    overflowY: "auto", // 내용이 넘칠 경우 스크롤 가능하도록 설정
  },
  title: {
    marginBottom: "20px",
    fontSize: "22px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  inputField: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  toneSelection: {
    marginBottom: "15px",
  },
  toneButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
  },
  toneButton: {
    padding: "8px 10px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  convertSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "10px",
  },
  convertLabel: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  convertButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  textArea: {
    marginTop: "15px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
    height: "300px", // 입력창 높이를 더 크게 설정
    resize: "none",
    boxSizing: "border-box",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  navButton: {
    backgroundColor: "#66b2ff", // 연한 파란색
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  pageInfo: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  closeButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    width: "48%",
    transition: "background-color 0.3s",
  },
  completeButton: {
    backgroundColor: "#0056b3",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    width: "48%",
    transition: "background-color 0.3s",
  },
};

export default PersonalizationModal;
