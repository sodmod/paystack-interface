import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { usePaystackPayment } from "react-paystack";

import { sendRequest } from "./customFunctions";

import styles from "./paystack.module.css";

const ModalOverlay = (props) => {
  return (
    <div className={styles.backdrop} onClick={props.onClose}>
      <div className={styles.modal}>Your payment is Successful</div>
    </div>
  );
};

const PaystackHook = () => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [transref, setTransref] = useState("");
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [OverLay, setOverLay] = useState(false);
  const [validInput, setValidInput] = useState(false);

  useEffect(() => {
    if (+amount < 100 && amount !== "") {
      setValidInput(false);
    } else {
      setValidInput(true);
    }
  }, [amount]);

  const config = {
    reference: reference,
    email: email,
    amount: +amount * 100,
    publicKey: "pk_test_6b5cb597abb805de0f6fd0f541c75c47cc659ad3",
  };

  const onSuccess = (reference) => {
    setTransref(reference.reference);
  };

  const onClose = () => {
    console.log("closed");
  };

  const initializePayment = usePaystackPayment(config);

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setAmount(event.target.value);
  };

  const onCLose = () => {
    setReference("");
    setOverLay((prev) => !prev);
    setShowVerifyButton((prev) => !prev);
  };

  const initialize = async (event) => {
    event.preventDefault();
    if (email !== "" && amount !== "") {
      const response = await sendRequest({
        url: "https://spring-paystack-services.onrender.com/api/transaction/initialize",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          email: email,
          amount: amount.toString(),
        },
      });

      if (response) {
        const reponse = response.data.data;
        config.reference = reponse?.reference || "";
        setReference(reponse?.reference);
        initializePayment(onSuccess, onClose);
        setShowVerifyButton((prev) => !prev);
        setEmail("");
        setAmount("");
      }
    } else {
      setValidInput(false);
    }
  };

  const verify = async (event) => {
    event.preventDefault();

    if (reference !== "") {
      const response = await sendRequest({
        url: "https://spring-paystack-services.onrender.com/api/transaction/verify",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          accessToken: transref,
        },
      });
      if (response) {
        setOverLay((prev) => !prev);
        return console.log("This is after verifying", response);
      }
    }
    console.log("Response is empty");
    return;
  };
  const portalElement = document.getElementById("overlays");

  return (
    <>
      {OverLay &&
        createPortal(<ModalOverlay onClose={onCLose} />, portalElement)}
      {
        <div className={styles.form}>
          <div className={styles["form-input"]}>
            <form onSubmit={initialize}>
              <input
                value={email}
                onChange={emailChangeHandler}
                type="email"
                placeholder="enter your mail"
              />
              <input
                value={amount}
                min="1"
                max="10000000"
                onChange={amountChangeHandler}
                type="text"
                placeholder="enter your amount"
              />
              {!validInput && (
                <p>
                  Both field must not be empty and The amount must be greater
                  100 naira naira
                </p>
              )}
              <button type="submit" disabled={!validInput}>
                Click here to pay
              </button>
            </form>
          </div>
          {showVerifyButton && (
            <div className={styles.verify}>
              <button onClick={verify}>
                Click here to verify your transaction
              </button>
            </div>
          )}
        </div>
      }
    </>
  );
};

export default PaystackHook;
