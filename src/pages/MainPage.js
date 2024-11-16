import React, { useState } from "react";
import ContactList from "../components/ContactList";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";

const MainPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messageFromState = location.state?.message || "";
  const [message, setMessage] = useState(messageFromState);

  return (
    <div style={styles.container}>
      {/* 상단부: 로고, 제목, 설명 */}
      <div style={styles.topSection}>
        <img src={logo} alt="service-logo" style={styles.image} />
        <h1>문자 자동생성 서비스</h1>
        <p>
          문자, 이미지 자동생성 서비스를 활용하여 편리하게 메시지를 전송하세요.
        </p>
      </div>

      {/* 중간 섹션: 문자 자동생성, 이미지 자동생성 */}
      <div style={styles.row}>
        {/* 문자 자동생성 섹션 */}
        <div style={styles.section}>
          <label style={styles.label}>메시지</label>
          <div
            contentEditable
            style={styles.fixedInput}
            onInput={(e) => setMessage(e.target.innerText)}
            placeholder="메시지를 입력하세요"
          >
            {message}
          </div>
          <button
            style={styles.button}
            onClick={() => navigate("/message-generation")}
          >
            문자 자동생성
          </button>
        </div>

        {/* 이미지 자동생성 섹션 */}
        <div style={styles.section}>
          <label style={styles.label}>이미지</label>
          <div style={styles.imageBox}>
            <span style={styles.imageText}>이미지가 여기에 표시됩니다.</span>
          </div>
          <button
            style={styles.button}
            onClick={() =>
              navigate("/image-generation", { state: { message } })
            }
          >
            이미지 자동생성
          </button>
        </div>
      </div>

      {/* 주소록 */}
      <ContactList message={message} setMessage={setMessage} />

      {/* 하단부: 챗봇 사용하기, 전송하기 버튼 */}
      <div style={styles.container}>
        <button
          style={styles.chatbotButton}
          onClick={() => navigate("/chatbot")}
        >
          챗봇 사용하기
        </button>

        <button style={styles.sendButton}>전송하기</button>
      </div>
    </div>
  );
};

const styles = {
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
    backgroundColor: "#F9FAFB", // 박스 배경 색상
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
    textAlign: "center", // 텍스트 중앙 정렬
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
    width: "100%", // 버튼 크기 맞추기
  },
  label: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#4A90E2",
  },
  fixedInput: {
    width: "100%",
    height: "400px", // 높이 줄이기
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
    transition: "border-color 0.3s",
    textAlign: "center", // 입력된 메시지를 중앙에 정렬
    wordWrap: "break-word", // 단어가 길어지면 줄 바꿈
    overflow: "hidden", // 텍스트가 넘치지 않도록 처리
    textOverflow: "ellipsis", // 텍스트 넘칠 경우 "..."
  },
  imageBox: {
    width: "100%",
    height: "400px", // 높이 맞추기
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #4A90E2",
    backgroundColor: "#ffffff",
    borderRadius: "4px",
    textAlign: "center",
    marginBottom: "10px",
    boxSizing: "border-box",
    fontSize: "20px", // 이미지 박스 내 텍스트 크기 조정
    color: "#A9A9A9", // 이미지 박스 내 텍스트 색상
    position: "relative",
  },
  imageText: {
    fontSize: "18px", // 텍스트 크기 조정
    color: "#4A90E2", // 강조된 텍스트 색상
    //textShadow: "0 0 5px rgba(0,0,0,0.3)", // 텍스트에 그림자 효과 추가
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
