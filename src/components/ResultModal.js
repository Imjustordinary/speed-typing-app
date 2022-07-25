import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ResultModal({ onCloseResultHandler, percentage, correctWords }) {
  return (
    <>
      <Modal show onHide={onCloseResultHandler} className="border-0">
        <Modal.Header closeButton>
          <Modal.Title className="border-0">Not bad! 🤔</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-12 d-flex">
            <div className="col-6 d-flex flex-column text-center">
              <span className="display-4">{correctWords}</span>
              <span className="">wph</span>
            </div>
            <div className="col-6 d-flex flex-column text-center">
              <span className="display-4">{percentage}%</span>
              <span className="">acc</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onCloseResultHandler}>
            Go back to Start page
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ResultModal;
