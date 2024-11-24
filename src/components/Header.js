import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png"; // 로고 이미지 경로

const Header = () => {
  return (
    <header style={styles.header}>
      {/* 왼쪽: 로고 */}
      <div style={styles.leftSection}>
        <Link to="/" style={styles.logoLink}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </Link>
      </div>

      {/* 가운데: 브랜드 이름 */}
      <h1 style={styles.brand}>BESTDAOU</h1>

      {/* 오른쪽: 사용자 이름 */}
      <div style={styles.rightSection}>
        <span style={styles.userName}>최고다우님</span>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff", // 흰색 배경
    height: "80px",
    padding: "0 20px",
    position: "fixed",
    width: "100%",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)", // 부드러운 그림자 추가
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  logoLink: {
    textDecoration: "none",
  },
  logo: {
    width: "60px",
    height: "60px",
  },
  brand: {
    fontSize: "27px",
    fontWeight: "bold",
    color: "#4A90E2", // 부드러운 파란색으로 브랜드 이름 설정
    marginLeft: "69px",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
  },
  userName: {
    fontSize: "24px",
    fontWeight: "500", // 더 부드러운 굵기
    color: "black",
    whiteSpace: "nowrap",
    marginRight: "70px",
    fontFamily: "'Noto Sans KR', sans-serif", // Google Fonts 적용
    letterSpacing: "0.5px", // 자간 조정으로 읽기 편하게
  },
};

export default Header;
