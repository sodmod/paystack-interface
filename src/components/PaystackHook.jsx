import { useState, useMemo } from "react";
import { usePaystackPayment } from "react-paystack";
import { sendRequest } from "./customFunctions";
import styles from "./paystack.module.css";

const onSuccess = (reference) => {
  console.log(reference);
};

const onClose = () => {
  console.log("closed");
};

const PaystackHook = (props) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  const config = {
    reference: reference,
    email: email,
    amount: amount,
    publicKey: "pk_test_6b5cb597abb805de0f6fd0f541c75c47cc659ad3",
  };

  const initializePayment = usePaystackPayment(config);

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const amountChangeHandler = (event) => {
    setAmount(event.target.value);
  };

  const initialize = async (event) => {
    event.preventDefault();

    const response = await sendRequest({
      url: "http://localhost:8021/api/transaction/initialize",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        email: email,
        amount: amount.toString(),
      },
    });

    if (response) {
      console.log("This is the value", response.data);
      const reponse = response.data.data;
      config.reference = reponse?.reference || "";
      setReference(reponse?.reference);
      console.log(config);
      initializePayment(onSuccess, onClose);
      // setAmount("");
      // setEmail("");
      // setReference("");
    }
  };

  return (
    <div className={styles.form}>
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
  );
};

export default PaystackHook;
