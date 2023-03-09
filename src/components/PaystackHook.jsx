import { useState } from "react";
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

const PaystackHook = (props) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [transref, setTransref] = useState("");
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [OverLay, setOverLay] = useState(false);

  const config = {
    reference: reference,
    email: email,
    amount: +amount * 100,
    publicKey: "pk_test_6b5cb597abb805de0f6fd0f541c75c47cc659ad3",
  };

  const onSuccess = (reference) => {
    console.log(reference.reference);
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
    console.log("1");
    if (email !== "" && amount !== "") {
      console.log("2");
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
        console.log("3");
        const reponse = response.data.data;
        config.reference = reponse?.reference || "";
        setReference(reponse?.reference);
        console.log("This is response", response);
        initializePayment(onSuccess, onClose);
        setShowVerifyButton((prev) => !prev);
        setEmail("");
        setAmount("");
      }
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
                type="text"
                placeholder="enter your mail"
              />
              <input
                value={amount}
                onChange={amountChangeHandler}
                type="number"
                placeholder="enter your amount in kobo"
              />
              <button type="submit">Click here to pay</button>
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
