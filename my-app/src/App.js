import React, { useState } from "react";
import "./App.css";
import Login from "./components/Login.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminView from "./components/AdminView";
import Deposit from "./components/Deposit";
import Withdraw from "./components/Withdraw";
import Transfer from "./components/Transfer";
import Transactions from "./components/Transactions";

function App() {
  // localStorage.clear();
  //for admin user details, planning to merge this with users
  const adminUser = {
    username: "admin",
    password: "pass123",
    name: "Administrator",
    isAdmin: true,
  };

  // list of users (work in progress)
  const userList = [
    {
      accountNo: null,
      firstName: "ADMINISTRATOR",
      lastName: "",
      balance: null,
      username: "admin",
      password: "pass123",
      isAdmin: true,
    },
    {
      accountNo: 111111,
      firstName: "JUAN",
      lastName: "DE LA CRUZ",
      balance: 2000,
      username: "juan",
      password: "pass123",
      isAdmin: false,
    },
    {
      accountNo: 111112,
      firstName: "JASON",
      lastName: "HO",
      balance: 6900,
      username: "jason",
      password: "jason123",
      isAdmin: false,
    },
    {
      accountNo: 111113,
      firstName: "EMAN",
      lastName: "SIA",
      balance: 4200,
      username: "eman",
      password: "eman123",
      isAdmin: false,
    },
  ];

  const transactionList = [
    // {
    //   key: 222221,
    //   type: "deposit",
    //   accountNo: 111111,
    //   firstName: "JUAN",
    //   lastName: "DE LA CRUZ",
    //   amount: 200,
    // },
    // {
    //   key: 222222,
    //   type: "withdrawal",
    //   accountNo: 111112,
    //   firstName: "JASON",
    //   lastName: "HO",
    //   amount: 100,
    // },
    // {
    //   key: 222223,
    //   type: "transfer",
    //   from: 111112,
    //   fromFirstName: "JASON",
    //   fromLastName: "HO",
    //   to: 111113,
    //   toFirstName: "EMAN",
    //   toLastName: "SIA",
    //   amount: 200,
    // },
  ];

  if (localStorage.bankUsers) {
    console.log("bankUsers exists in local storage");
    console.log(localStorage.bankUsers);
  } else {
    localStorage.bankUsers = JSON.stringify(userList);
    console.log("bankUsers does not exist in local storage, just created.");
    console.log(localStorage.bankUsers);
  }

  if (localStorage.transactionHistory) {
    console.log("transactionHistory exists in local storage");
    console.log(localStorage.transactionHistory);
  } else {
    localStorage.transactionHistory = JSON.stringify(transactionList);
    console.log(
      "transactionHistory does not exist in local storage, just created."
    );
    console.log(localStorage.transactionHistory);
  }

  if (localStorage.accountNumber) {
    console.log("accountNumber already exists in local storage.");
    console.log(localStorage.accountNumber);
  } else {
    localStorage.accountNumber = 111113;
    console.log(localStorage.accountNumber);
  }

  if (localStorage.transactionKey) {
    console.log("transactionKey already exists in local storage.");
    console.log(localStorage.transactionKey);
  } else {
    localStorage.transactionKey = 222220;
    console.log(localStorage.transactionKey);
  }

  function generateAccountNumber() {
    const oldAccountNumber = parseInt(localStorage.accountNumber);
    const newAccountNumber = oldAccountNumber + 1;
    localStorage.accountNumber = newAccountNumber;
    return newAccountNumber;
  }
  function generateTransactionKey() {
    const oldTransactionKey = parseInt(localStorage.transactionKey);
    const newTransactionKey = oldTransactionKey + 1;
    localStorage.transactionKey = newTransactionKey;
    return newTransactionKey;
  }

  function addUser(firstName, lastName, balance, username, password) {
    let newUserList = [
      ...users,
      {
        accountNo: generateAccountNumber(),
        firstName: firstName,
        lastName: lastName,
        balance: balance,
        username: username,
        password: password,
        isAdmin: false,
      },
    ];
    setUserList(newUserList);
    localStorage.bankUsers = JSON.stringify(newUserList);
    console.log(localStorage.bankUsers);
  }

  function transfer(amount, from, to) {
    const userCopy = [...users];
    const accountNos = userCopy.map((user) => user.accountNo);
    const fromIndex = accountNos.findIndex((accountNo) => accountNo == from);
    const toIndex = accountNos.findIndex((accountNo) => accountNo == to);
    userCopy[fromIndex].balance -= amount;
    userCopy[toIndex].balance += amount;
    setUserList(userCopy);

    const newTransactions = [
      ...transactions,
      {
        key: generateTransactionKey(),
        type: "transfer",
        from: from,
        fromFirstName: userCopy[fromIndex].firstName,
        fromLastName: userCopy[fromIndex].lastName,
        to: to,
        toFirstName: userCopy[toIndex].firstName,
        toLastName: userCopy[toIndex].lastName,
        amount: amount,
      },
    ];
    setTransactions(newTransactions);
    localStorage.transactionHistory = JSON.stringify(newTransactions);
    localStorage.bankUsers = JSON.stringify(userCopy);
  }

  function deposit(amount, account) {
    const userCopy = [...users];
    const accountNos = userCopy.map((user) => user.accountNo);
    const accountIndex = accountNos.findIndex(
      (accountNo) => accountNo == account
    );
    userCopy[accountIndex].balance += amount;
    setUserList(userCopy);

    const newTransactions = [
      ...transactions,
      {
        key: generateTransactionKey(),
        type: "deposit",
        accountNo: account,
        firstName: userCopy[accountIndex].firstName,
        lastName: userCopy[accountIndex].lastName,
        amount: amount,
      },
    ];
    setTransactions(newTransactions);
    localStorage.transactionHistory = JSON.stringify(newTransactions);
    localStorage.bankUsers = JSON.stringify(userCopy);
  }

  function withdraw(amount, account) {
    const userCopy = [...users];
    const accountNos = userCopy.map((user) => user.accountNo);
    const accountIndex = accountNos.findIndex(
      (accountNo) => accountNo == account
    );
    userCopy[accountIndex].balance -= amount;
    setUserList(userCopy);

    const newTransactions = [
      ...transactions,
      {
        key: generateTransactionKey(),
        type: "withdrawal",
        accountNo: account,
        firstName: userCopy[accountIndex].firstName,
        lastName: userCopy[accountIndex].lastName,
        amount: amount,
      },
    ];
    setTransactions(newTransactions);
    localStorage.transactionHistory = JSON.stringify(newTransactions);
    localStorage.bankUsers = JSON.stringify(userCopy);
  }

  const [users, setUserList] = useState(JSON.parse(localStorage.bankUsers));

  //state for user details
  const [currentUser, setUser] = useState({ name: "", username: "" });

  //state for error message if login failed
  const [error, setError] = useState("");

  //function for logging in
  const LoginFunction = (details) => {
    console.log(details);
    if (
      details.username === adminUser.username &&
      details.password === adminUser.password
    ) {
      setUser({
        name: adminUser.name,
        username: adminUser.username,
      });
      setError("");
    } else {
      setError("Login failed. Please try again.");
    }
  };

  //function for logging out
  const Logout = () => {
    console.log("Logout");
    setUser({ name: "", username: "" });
  };

  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.transactionHistory)
  );

  return (
    <div className="body">
      {/* If the user info is not blank, show dashboard */}
      {currentUser.username !== "" ? (
        <Router>
          <Navbar LogoutFunction={Logout} />
          <div className="main-content">
            <Switch>
              <Route
                path="/"
                exact
                component={() => (
                  <AdminView
                    name={currentUser.name}
                    users={users}
                    addUser={(
                      firstName,
                      lastName,
                      balance,
                      username,
                      password
                    ) => {
                      addUser(firstName, lastName, balance, username, password);
                    }}
                  />
                )}
              />
              <Route
                path="/deposit"
                component={() => (
                  <Deposit
                    users={users}
                    deposit={(amount, account) => {
                      deposit(amount, account);
                    }}
                  />
                )}
              />
              <Route
                path="/withdraw"
                component={() => (
                  <Withdraw
                    users={users}
                    withdraw={(amount, account) => {
                      withdraw(amount, account);
                    }}
                  />
                )}
              />
              <Route
                path="/transfer"
                component={() => (
                  <Transfer
                    users={users}
                    transfer={(amount, from, to) => {
                      transfer(amount, from, to);
                    }}
                  />
                )}
              />
              <Route
                path="/transactions"
                component={() => <Transactions transactions={transactions} />}
              />
            </Switch>
          </div>
        </Router>
      ) : (
        /* If there is no current user, show login page */
        <Login LoginFunction={LoginFunction} error={error} />
      )}
    </div>
  );
}

export default App;
