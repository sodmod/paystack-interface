import { useState } from "react";
import { sendRequest } from "./customFunctions";
import Modal from "./Modal";

import styles from "./overlay.module.css";

const config = {
  reference: "",
  email: "",
  amount: "10000000",
  publicKey: "pk_test_6b5cb597abb805de0f6fd0f541c75c47cc659ad3",
};

const onSuccess = (reference) => {
  console.log(reference);
};

const onClose = () => {
  console.log("closed");
};

const Overlay = (props) => {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  //   const initializePayment = usePaystackPayment(config);

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
    }
  };
  return (
    <Modal onClose={props.onClose}>
      <div className={styles.form}>
        <div className={styles["form-center"]}>
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
      </div>
    </Modal>
  );
};

export default Overlay;
