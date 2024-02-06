import react, { useReducer, useState } from "react";
import Button from "./Button";
import Operation from "./Operation";
import classes from "./Calculator.module.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DEl_OPERATION: "delete",
  EVALUATION: "evaluation",
};

const initialState = {
  previousOperand: "",
  currentOperand: "",
  operation: "",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.previousOperand == "" && state.currentOperand == "") {
        return state;
      }
      if (state.previousOperand == "") {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: "",
        };
      }
      if (state.currentOperand == "") {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: "",
      };

    case ACTIONS.CLEAR:
      return initialState;

    case ACTIONS.DEl_OPERATION:
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case ACTIONS.EVALUATION:
      if (
        state.currentOperand == "" ||
        state.previousOperand == "" ||
        state.operation == ""
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        operation: "",
        previousOperand: "",
        currentOperand: evaluate(state),
      };
  }
};

const evaluate = ({ currentOperand, previousOperand, operation }) => {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";

  switch (operation) {
    case "/":
      computation = prev / current;
      break;
    case "%":
      computation =  (prev/100)*current;
      break;
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
  }

  return computation.toString();
};

const Calculator = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <div className={classes["calculator-grid"]}>
      <div className={classes.output}>
        <div className={classes["previous-operand"]}>
          {previousOperand} {operation}
        </div>
        <div className={classes["current-operand"]}>{currentOperand}</div>
      </div>
      <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DEl_OPERATION })}>
        DEL
      </button>
      <Operation operation="%" dispatch={dispatch} />
      <Operation operation="/" dispatch={dispatch} />
      <Button digit="1" dispatch={dispatch} />
      <Button digit="2" dispatch={dispatch} />
      <Button digit="3" dispatch={dispatch} />
      <Operation operation="*" dispatch={dispatch} />
      <Button digit="4" dispatch={dispatch} />
      <Button digit="5" dispatch={dispatch} />
      <Button digit="6" dispatch={dispatch} />
      <Operation operation="+" dispatch={dispatch} />
      <Button digit="7" dispatch={dispatch} />
      <Button digit="8" dispatch={dispatch} />
      <Button digit="9" dispatch={dispatch} />
      <Operation operation="-" dispatch={dispatch} />
      <Button digit="." dispatch={dispatch} />
      <Button digit="0" dispatch={dispatch} />
      <button
        className={classes["span-two"]}
        onClick={() => dispatch({ type: ACTIONS.EVALUATION })}
      >
        =
      </button>
    </div>
  );
};

export default Calculator;
