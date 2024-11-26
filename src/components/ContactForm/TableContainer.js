// TableContainer.js
import React, { useState } from "react";

const styles = {
  title: {
    textAlign: "center",
    color: "#000",
    marginBottom: "10px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  contactList: {
    maxHeight: "450px",
    overflowY: "scroll",
    borderRadius: "8px",
    border: "1px solid #ccc",
    padding: "0",
    margin: "0",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "960px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    borderSpacing: "0",
  },
  th: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "12px",
    fontSize: "18px",
    textAlign: "left",
    position: "sticky",
    top: "0",
    zIndex: 1,
  },
  td: {
    fontSize: "16px",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #bbdefb",
    wordBreak: "break-word",
  },
  truncatedText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "150px", // 줄임표 적용할 최대 너비
    display: "inline-block",
    verticalAlign: "middle",
  },
  fullText: {
    whiteSpace: "normal", // 텍스트 전체 표시
  },
  moreButton: {
    marginLeft: "10px",
    backgroundColor: "#1976d2",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "4px 8px",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#ef5350",
    color: "white",
    padding: "8px 12px",
    fontSize: "14px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

const TableContainer = ({ contacts, setContacts }) => {
  const [expandedTags, setExpandedTags] = useState({});
  const [expandedTones, setExpandedTones] = useState({});

  const toggleExpandTag = (index) => {
    setExpandedTags((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleExpandTone = (index) => {
    setExpandedTones((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDelete = (index) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      setContacts((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <h2 style={styles.title}>연락처 목록</h2>
      <div style={styles.contactList}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "80px" }}>이름</th>
              <th style={{ ...styles.th, width: "120px" }}>번호</th>
              <th style={{ ...styles.th, width: "220px" }}>특징</th>
              <th style={{ ...styles.th, width: "270px" }}>어조</th>
              <th style={{ ...styles.th, width: "80px" }}>삭제</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <tr key={index}>
                  <td style={styles.td}>{contact.name}</td>
                  <td style={styles.td}>{contact.phone}</td>
                  <td style={styles.td}>
                    <span
                      style={
                        expandedTags[index]
                          ? styles.fullText
                          : styles.truncatedText
                      }
                    >
                      {contact.tag}
                    </span>
                    {contact.tag && contact.tag.length > 20 && (
                      <button
                        style={styles.moreButton}
                        onClick={() => toggleExpandTag(index)}
                      >
                        {expandedTags[index] ? "접기" : "더보기"}
                      </button>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span
                      style={
                        expandedTones[index]
                          ? styles.fullText
                          : styles.truncatedText
                      }
                    >
                      {contact.tone}
                    </span>
                    {contact.tone.length > 30 && (
                      <button
                        style={styles.moreButton}
                        onClick={() => toggleExpandTone(index)}
                      >
                        {expandedTones[index] ? "접기" : "더보기"}
                      </button>
                    )}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(index)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.td}>
                  아직 추가된 연락처가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableContainer;
