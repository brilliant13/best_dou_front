import React, { useState } from "react";

const FormContainer = ({ contact, setContact, handleAddContact }) => {
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // 전화번호 형식이 올바른지 검사
      const phonePattern = /^010\d{8}$/;
      if (value && !phonePattern.test(value)) {
        setPhoneError("올바른 형식: 01012345678");
      } else {
        setPhoneError("");
      }
    }

    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!contact.phone) {
      setPhoneError("전화번호를 입력해주세요.");
      return;
    }

    if (phoneError) {
      alert("전화번호 형식을 확인해주세요.");
      return;
    }

    // handleAddContact를 호출해 새 연락처 추가
    handleAddContact(contact);

    // 폼 초기화
    setContact({ name: "", phone: "", tag: "", tone: "" });
  };

  return (
    <div>
      <h2 style={styles.title}>연락처 추가</h2>
      <form onSubmit={handleSubmit} style={styles.contactForm}>
        <label>이름:</label>
        <input
          type="text"
          name="name"
          placeholder="이름 입력"
          value={contact.name}
          onChange={handleChange}
          style={styles.input}
        />
        <label>번호:</label>
        <input
          type="text"
          name="phone"
          placeholder="전화번호 입력 (예: 01012345678)"
          value={contact.phone}
          onChange={handleChange}
          style={styles.input}
        />
        {phoneError && <p style={styles.errorMessage}>{phoneError}</p>}
        <label>특징:</label>
        <input
          type="text"
          name="tag"
          placeholder="특징 입력"
          value={contact.tag}
          onChange={handleChange}
          style={styles.input}
        />
        <label>어조:</label>
        <input
          type="text"
          name="tone"
          placeholder="어조 입력"
          value={contact.tone}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          추가
        </button>
      </form>
    </div>
  );
};

const styles = {
  title: {
    textAlign: "center",
    color: "#000",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  contactForm: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  input: {
    padding: "15px",
    fontSize: "18px",
    border: "1px solid #bbdefb",
    borderRadius: "8px",
    backgroundColor: "white",
    transition: "border-color 0.3s",
  },
  button: {
    backgroundColor: "#1e88e5",
    color: "white",
    padding: "15px",
    fontSize: "18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginTop: "-15px",
    marginBottom: "10px",
  },
};

export default FormContainer;
