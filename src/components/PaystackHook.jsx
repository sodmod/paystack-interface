import styles from "./paystack.module.css";
import Paystack from "../images/Paystack.png";

const PaystackHook = (props) => {
  return (
    <div className={styles.paystack}>
      <img src={Paystack} alt="" />
      <div>
        <button onClick={props.onClick}>Payment Method</button>
      </div>
    </div>
  );
};

export default PaystackHook;
