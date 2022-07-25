import React, { useCallback, useEffect, useRef, useState } from "react";
import randomWords from "random-words";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import ResultModal from "./ResultModal";

const WORDS = 200;

function TypingScreen() {
  const [paragraph, setParagraph] = useState(
    new Array(WORDS).fill().map(() => randomWords())
  );
  const [classSecond, setClassSecond] = useState("text-success");
  const [myInterval, setMyInterval] = useState();
  const [seconds, setSeconds] = useState(60);
  const inputText = useRef();

  const [correctWords, setCorrectWords] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(-1);
  const [currentWord, setCurrentWord] = useState("");
  const [currentChar, setCurrentChar] = useState("");
  const [started, setStarted] = useState(false);
  const [inputDisable, setInputDisable] = useState(true);

  const [showResult, setShowResult] = useState(false);

  const onCloseResultHandler = () => {
    setShowResult(false);
    setSeconds(60);
    setCharIndex(-1);
    setCurrentChar("");
    setCurrentIndex(0);
    setCurrentIndex(0);
    setClassSecond("text-success");
    setCurrentWord("");
    setStarted(false);
    setInputDisable(true);
    clearInterval(myInterval);

    setCorrectWords(0);
    setTotalWords(0);
    setPercentage(0);
    setParagraph(new Array(WORDS).fill().map(() => randomWords()));
    inputText.current.value = "";
  };

  const onStartHandler = useCallback(() => {
    setMyInterval(setInterval(() => setSeconds((prev) => prev - 1), 1000));
    setCurrentWord(paragraph[currentIndex]);
    setStarted(true);
    setInputDisable(false);
  }, []);

  useEffect(() => {
    if (!inputDisable) {
      inputText.current.focus();
    }
  }, [inputDisable]);

  const resultCalculation = () => {
    if (correctWords === 0 && totalWords === 0) {
      setPercentage(0);
    } else {
      setPercentage(Math.round((correctWords / totalWords) * 100));
    }
  };

  useEffect(() => {
    if (seconds < 31 && seconds > 21) {
      setClassSecond("text-warning");
    } else if (seconds < 21) {
      setClassSecond("text-danger");
    }
    if (seconds < 1) {
      clearInterval(myInterval);
      setShowResult(true);
      resultCalculation();
    }
  }, [seconds]);

  const onKeyDownHandler = ({ keyCode, key }) => {
    if (keyCode === 32) {
      if (paragraph[currentIndex] === inputText.current.value.trim()) {
        setCorrectWords((prev) => prev + 1);
      }
      setCurrentIndex((prev) => prev + 1);
      inputText.current.value = "";
      setCurrentWord(paragraph[currentIndex + 1]);
      setCharIndex(-1);
      setCurrentChar("");
      setTotalWords((prev) => prev + 1);
    } else if (keyCode === 8) {
      if (charIndex === 0) {
        setCurrentChar("");
      } else if (charIndex < 0) {
        setCurrentChar("");
        setCharIndex(-1);
        return;
      } else {
        setCurrentChar(currentWord.split("")[charIndex - 1]);
      }
      setCharIndex((prev) => prev - 1);
    } else {
      setCharIndex((prev) => prev + 1);
      setCurrentChar(key);
    }
  };

  const getCharClass = useCallback(
    (wordIdx, idx, char) => {
      if (started && currentChar.length > 0) {
        if (wordIdx === currentIndex) {
          if (charIndex === idx) {
            if (currentChar === char) {
              return "bg-success text-light";
            } else {
              return "bg-danger text-light";
            }
          }
        }
      }
      // setCharIndex(prev=>prev +1)
    },
    [charIndex, currentChar]
  );

  return (
    <Container>
      {showResult && (
        <ResultModal
          percentage={percentage}
          correctWords={correctWords}
          onCloseResultHandler={onCloseResultHandler}
        />
      )}
      <Row className="col-lg-9 mx-auto">
        <Col>
          <div className="my-3">
            <p className="h1 text-center">Typing speed tester 🏃🏻‍♂️</p>
          </div>
          <div className="my-3">
            <h1 className={"display-4 text-center ".concat(classSecond)}>
              {seconds}
            </h1>
          </div>
          <div>
            <Form>
              <Form.Group className="mb-3" controlId="formTypeInput">
                {/* <Form.Label>Email address</Form.Label> */}
                <Form.Control
                  ref={inputText}
                  onKeyDown={onKeyDownHandler}
                  type="text"
                  disabled={inputDisable}
                  autoComplete="off"
                />
              </Form.Group>
            </Form>
          </div>

          <div className="my-3">
            {started ? (
              <Button onClick={onCloseResultHandler} className="col-12">
                Restart
              </Button>
            ) : (
              <Button onClick={onStartHandler} className="col-12">
                Start
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Row className="col-lg-9 mx-auto">
        <Col>
          <div style={{ textAlign: "justify" }}>
            {/* {paragraph.join(" ")} */}
            {started &&
              paragraph.map((each, index) => {
                return (
                  <span key={each + index}>
                    <span
                      style={{ fontWeight: index === currentIndex && "bold" }}
                    >
                      {each.split("").map((singleWord, singleIndex) => {
                        return (
                          <span
                            key={singleWord + singleIndex}
                            className={getCharClass(
                              index,
                              singleIndex,
                              singleWord
                            )}
                          >
                            {singleWord}
                          </span>
                        );
                      })}
                    </span>
                    <span> </span>
                  </span>
                );
              })}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TypingScreen;
