import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

const ImageGeneration = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Define navigate
    const [inputText, setInputText] = useState(location.state?.message || ''); 
    const [style, setStyle] = useState(null);
    const [subject, setSubject] = useState(null);
    const [emotion, setEmotion] = useState(null);
    const [background, setBackground] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null); 
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); 

    const translateCategory = (category, selection) => {
        const translations = {
            style: {
                '사실적': 'realistic',
                '애니메이션': 'animation',
                '일러스트': 'illustration',
                '픽셀 아트': 'pixel art'
            },
            subject: {
                '청첩장': 'invitation',
                '축하 문자': 'congratulation message',
                '안부 문자': 'greeting message',
                '소식 전달': 'announcement'
            },
            emotion: {
                '행복한': 'happy',
                '슬픈': 'sad',
                '차분한': 'calm',
                '에너지 넘치는': 'energetic'
            },
            background: {
                '실내': 'indoor',
                '야외': 'outdoor',
                '도시': 'city',
                '해변': 'beach'
            }
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

        setIsButtonDisabled(true);

        const requestData = {
            style: translateCategory('style', style),
            subject: translateCategory('subject', subject),
            emotion: translateCategory('emotion', emotion),
            background: translateCategory('background', background),
            message: inputText
        };

        fetch("http://localhost:8080/api/images/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "success") {
                setGeneratedImage(data.imageUrl);
                alert(data.message);
            } else {
                alert(data.message);
            }
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => {
            setTimeout(() => setIsButtonDisabled(false), 10000);
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.row}>
                <div style={styles.column}>
                    <h2>발송 목적 및 내용</h2>
                    
                    <textarea
                        placeholder="text 입력"
                        value={inputText}
                        onChange={handleInputChange}
                        style={styles.textArea}
                    />

                    <div style={styles.keywordContainer}>
                        <h3>주요 키워드 제시</h3>
                        <div style={styles.keywordButtons}>
                            <CategorySelector label="스타일" options={["사실적", "애니메이션", "일러스트", "픽셀 아트"]} selected={style} onSelect={setStyle} />
                            <CategorySelector label="목적" options={["청첩장", "축하 문자", "안부 문자", "소식 전달"]} selected={subject} onSelect={setSubject} />
                            <CategorySelector label="감정/분위기" options={["행복한", "슬픈", "차분한", "에너지 넘치는"]} selected={emotion} onSelect={setEmotion} />
                            <CategorySelector label="배경" options={["실내", "야외", "도시", "해변"]} selected={background} onSelect={setBackground} />
                        </div>
                    </div>
                    
                    <button onClick={handleSubmit} style={styles.generateButton} disabled={isButtonDisabled}>
                        {isButtonDisabled ? "생성 중..." : "이미지 생성"}
                    </button>
                </div>

                <div style={styles.column}>
                    <h2>생성결과</h2>
                    <div style={styles.imageDisplay}>
                        {generatedImage ? (
                            <img src={generatedImage} alt="Generated" style={styles.generatedImage} />
                        ) : (
                            <p>이미지를 생성하세요</p>
                        )}
                    </div>
                    <button
                        onClick={() => navigate("/", { state: { generatedImage } })}
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
                    backgroundColor: selected === option ? '#007bff' : '#e1e5f2',
                    color: selected === option ? 'white' : 'black',
                }}
            >
                {option}
            </button>
        ))}
    </div>
);

// 스타일 정의
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
        backgroundColor: '#e1e5f2',
        margin: '5px',
    },
    generateButton: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#b3c7ff',
        border: 'none',
        borderRadius: '8px',
    },
    imageDisplay: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '8px',
        height: '250px',
        marginBottom: '20px',
    },
    generatedImage: {
        maxWidth: '100%',
        maxHeight: '100%',
    },
    useButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#b3c7ff',
        border: 'none',
        borderRadius: '8px',
        alignSelf: 'center',
        marginTop: '186px',
    },
};

export default ImageGeneration;
