//src/pages/MainPage.js
import React, { useState } from "react";
import ContactList from "../components/ContactList";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import axios from "axios";
import { DiFirebase } from "react-icons/di";
import { sendMessages } from "../services/PpurioApiService";

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달된 state에서 메시지와 이미지를 추출
  const messageFromState = location.state?.message || "";
  const [message, setMessage] = useState(messageFromState);
  const generatedImage = location.state?.generatedImage || null; // Retrieve the generated image URL
  const [convertedTexts, setConvertedTexts] = useState({}); // 수신자별 메시지 상태
  const [selectedContacts, setSelectedContacts] = useState([]); // 선택된 연락처 목록
  const [currentContactIndex, setCurrentContactIndex] = useState(0); //현재 어떤 수신자인지 인덱스 표시
  console.log(convertedTexts);
  console.log(selectedContacts);
  // 메시지에서 키워드를 추출하는 함수
  const extractKeywords = async (message) => {
    try {
      const prompt = `
        Please extract one single keyword in English from the following message that can be used for image generation.

        메시지: ${message}

        키워드:
      `;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are an NLP expert. Extract exactly one relevant keyword in English from the provided message that can be used for image generation. The keyword must be concise and relevant.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 100,
          temperature: 0.5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
        }
      );

      const keywords = response.data.choices[0].message.content.trim();
      return keywords.split(",").map((keyword) => keyword.trim());
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const handleImageGeneration = async () => {
    if (!message.trim()) {
      alert("메시지를 입력하세요.");
      return;
    }

    try {
      const extractedKeywords = await extractKeywords(message);

      if (extractedKeywords.length === 0) {
        alert("키워드를 추출하지 못했습니다. 메시지를 확인해주세요.");
        return;
      }

      const keyword = extractedKeywords[0];
      console.log("추출된 키워드:", keyword);

      navigate("/image-generation", { state: { message, keyword } });
    } catch (error) {
      console.error("키워드 추출 중 오류 발생:", error);
      alert("키워드 추출에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // const handleSendButtonClick = async () => {
  //   const mergedData = mergePhoneAndMessages(); // 데이터 생성

  //   try {
  //     const response = await sendMessages(mergedData); // API 호출
  //     console.log("서버 응답:", response.data);
  //     alert("메시지가 성공적으로 전송되었습니다!");
  //   } catch (error) {
  //     console.error("메시지 전송 실패:", error);
  //     alert("메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
  //   }
  // };

  const handleSendButtonClick = async () => {
    const mergedData = mergePhoneAndMessages(); // 데이터 병합 (전화번호, 메시지, 이미지)
  
    try {
      const response = await sendMessages(mergedData); // API 호출
      console.log("서버 응답:", response.data);
      alert("메시지가 성공적으로 전송되었습니다!");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      alert("메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };
  


  // phone과 convertedTexts를 합쳐 새로운 객체 생성
  // const mergePhoneAndMessages = () => {
  //   const mergedData = selectedContacts.map((contact) => {
  //     const message = convertedTexts[contact.id] || ""; // 해당 ID의 문자 내용을 가져옴
  //     return {
  //       recipientPhoneNumber: contact.phone, // phone을 recipientPhoneNumber로 저장
  //       messageContent: message, // message를 messageContent로 저장
  //     };
  //   });

  //   console.log("Merged Data:", mergedData); // 결과 확인용
  //   return mergedData;
  // };
  const mergePhoneAndMessages = () => {
    const mergedData = selectedContacts.map((contact) => {
      const message = convertedTexts[contact.id] || ""; // 선택된 연락처에 해당하는 메시지 내용 가져오기
      return {
        recipientPhoneNumber: contact.phone, // 전화번호
        messageContent: message, // 메시지 내용
        image: generatedImage || null, // 생성된 이미지 추가
      };
    });
  
    console.log("Merged Data:", mergedData); // 데이터 확인용 로그
    return mergedData;
  };





  return (
    <div style={styles.container}>
      <div style={styles.topSection}>
        <img src={logo} alt="service-logo" style={styles.image} />
        <h1>문자 자동생성 서비스</h1>
        <p>
          문자, 이미지 자동생성 서비스를 활용하여 편리하게 메시지를 전송하세요.
        </p>
      </div>

      <div style={styles.row}>
        <div style={styles.section}>
          <label style={styles.label}>메시지</label>
          {selectedContacts.length > 0 ? (
            <>
              {/* 현재 선택된 연락처의 변환된 메시지 표시 */}
              <textarea
                style={styles.textArea}
                value={
                  convertedTexts[selectedContacts[currentContactIndex]?.id] ||
                  message
                }
                onChange={(e) => {
                  const updatedMessage = e.target.value;
                  setConvertedTexts((prev) => ({
                    ...prev,
                    [selectedContacts[currentContactIndex]?.id]: updatedMessage,
                  }));
                }}
              ></textarea>

              {/* 현재 수신자 인덱스 및 이름 표시 */}
              <p style={styles.contactInfo}>
                {`수신자 ${currentContactIndex + 1} / ${
                  selectedContacts.length
                } : ${selectedContacts[currentContactIndex].name}`}
              </p>

              {/* 이전/다음 버튼 */}
              <div style={styles.navigationButtons}>
                <button
                  style={styles.navButton}
                  disabled={currentContactIndex === 0}
                  onClick={() =>
                    setCurrentContactIndex((prevIndex) =>
                      Math.max(prevIndex - 1, 0)
                    )
                  }
                >
                  이전
                </button>
                <button
                  style={styles.navButton}
                  disabled={currentContactIndex === selectedContacts.length - 1}
                  onClick={() =>
                    setCurrentContactIndex((prevIndex) =>
                      Math.min(prevIndex + 1, selectedContacts.length - 1)
                    )
                  }
                >
                  다음
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 선택된 연락처가 없을 경우 기본 메시지 입력 */}
              <textarea
                style={styles.textArea}
                placeholder="메시지를 입력하세요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </>
          )}
          <button
            style={styles.button}
            onClick={() => navigate("/message-generation")}
          >
            문자 자동생성
          </button>
        </div>

        <div style={styles.section}>
          <label style={styles.label}>이미지</label>
          <div style={styles.imageBox}>
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Generated"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              "이미지가 여기에 표시됩니다."
            )}
          </div>
          <button style={styles.button} onClick={handleImageGeneration}>
            이미지 자동생성
          </button>
        </div>
      </div>

      {/* 주소록 */}
      <ContactList
        message={message}
        setMessage={setMessage}
        convertedTexts={convertedTexts}
        setConvertedTexts={setConvertedTexts}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
      />

      <div style={styles.container}>
        <button
          style={styles.chatbotButton}
          onClick={() => navigate("/chatbot")}
        >
          챗봇 사용하기
        </button>

        <button style={styles.sendButton} onClick={handleSendButtonClick}>
          전송하기
        </button>
      </div>
    </div>
  );
};

const styles = {
  navigationButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
    gap: "20px", // 버튼 간격 추가
  },
  navButton: {
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  contactName: {
    marginTop: "10px",
    fontSize: "18px",
    fontWeight: "bold",
  },
  contactInfo: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#555",
  },
  // 기존 스타일 정의
  container: {
    margin: "85px",
    backgroundColor: "white",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  topSection: {
    textAlign: "center",
    marginBottom: "40px",
  },
  image: {
    width: "100px",
    height: "100px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: "1200px",
    marginBottom: "40px",
    gap: "20px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    padding: "30px",
    borderRadius: "8px",
    minWidth: "450px",
    boxSizing: "border-box",
    backgroundColor: "#F9FAFB",
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#4A90E2",
    color: "white",
    border: "none",
    padding: "15px 30px",
    fontSize: "18px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
    width: "100%",
  },
  label: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#4A90E2",
  },
  textArea: {
    width: "100%",
    height: "400px",
    padding: "20px",
    fontSize: "16px",
    border: "1px solid #4A90E2",
    borderRadius: "8px",
    resize: "none",
    boxSizing: "border-box",
    backgroundColor: "#FFFFFF",
    color: "#333",
    lineHeight: "1.5",
    outline: "none",
    marginBottom: "10px",
  },
  imageBox: {
    width: "100%",
    height: "400px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #4A90E2",
    backgroundColor: "#ffffff",
    borderRadius: "4px",
    textAlign: "center",
    marginBottom: "10px",
    boxSizing: "border-box",
    fontSize: "20px",
    color: "#A9A9A9",
  },
  chatbotButton: {
    backgroundColor: "#4A90E2",
    color: "white",
    border: "none",
    padding: "20px 40px",
    fontSize: "20px",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "20px",
  },
  sendButton: {
    backgroundColor: "#4A90E2",
    color: "white",
    border: "none",
    padding: "15px 30px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default MainPage;
