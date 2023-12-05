import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowTrendUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowTrendDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FilledInput from "@mui/material/FilledInput";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import React from "react";
import CountUp from "react-countup";
import { Navigate, useNavigate } from "react-router-dom";

import "./HomePage.css";

export default function HomePage() {
  const [amount, setAmount] = React.useState("");
  const [toId, setToId] = React.useState("");
  const [shouldRedirect, setShouldRedirect] = React.useState(false);
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const [userInfo, setUserInfo] = React.useState({
    userName: "",
    balance: 0,
    BTC: 0,
    ETH: 0,
    LTC: 0,
    DOGE: 0,
    XLM: 0,
  });

  const [cryptoPrices, setCryptoPrices] = React.useState({
    BTC: 0,
    ETH: 0,
    LTC: 0,
    DOGE: 0,
    XLM: 0,
  });

  const [cryptoAmounts, setCryptoAmounts] = React.useState({
    BTC: 0,
    ETH: 0,
    LTC: 0,
    DOGE: 0,
    XLM: 0,
  });

  const [cryptoDynamicValues, setCryptoDynamicValues] = React.useState({
    BTC: 0,
    ETH: 0,
    LTC: 0,
    DOGE: 0,
    XLM: 0,
  });

  const [balanceUpdated, setBalanceUpdated] = React.useState(false);
  const [selectedAction, setSelectedAction] = React.useState(null);

  const buttonsETH = [
    <Button key="one">Buy</Button>,
    <Button key="two">Sell</Button>,
  ];

  const buttonsLTC = [
    <Button key="one">Buy</Button>,
    <Button key="two">Sell</Button>,
  ];

  const buttonsDOGE = [
    <Button key="one">Buy</Button>,
    <Button key="two">Sell</Button>,
  ];

  const buttonsXLM = [
    <Button key="one">Buy</Button>,
    <Button key="two">Sell</Button>,
  ];

  function fetchUserInfo() {
    fetch("/getUser")
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setUserInfo(apiRes.data[0]); // Assuming the user information is returned as an array with one item
        setBalanceUpdated(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function Logout() {
    fetch("/logout")
      .then((res) => res.json(navigate("/")))
      .then((apiRes) => {
        console.log(apiRes);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleActionClick(action) {
    setSelectedAction(action);
  }

  function updateAmount(event) {
    const numberValue = Number(event.target.value);
    console.log(numberValue);
    setAmount(event.target.value);
  }

  function updateToId(event) {
    const stringValue = String(event.target.value);
    console.log(stringValue);
    setToId(event.target.value);
  }

  function deposit() {
    const transactionDto = {
      amount: Number(amount),
    };
    const options = {
      method: "POST",
      body: JSON.stringify(transactionDto),
      credentials: "include",
    };
    fetch("/createDeposit", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setAmount("");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      }); // it did not work
  }

  function transfer() {
    const transactionDto = {
      amount: Number(amount),
      toId: String(toId),
    };
    const options = {
      method: "POST",
      body: JSON.stringify(transactionDto),
      credentials: "include",
    };
    fetch("/transfer", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setAmount("");
        setToId("");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      }); // it did not work
  }

  async function withdraw() {
    const transactionDto = {
      amount: Number(amount),
    };
    const options = {
      method: "POST",
      body: JSON.stringify(transactionDto),
      credentials: "include",
    };
    const result = await fetch("/withdraw", options);
    const apiRes = await result.json();
    setAmount("");
    window.location.reload();
  }

  function generateRandomPrice(min, max) {
    const randomNumber = Math.random() * (max - min) + min;
    const roundedNumber = Number(randomNumber.toFixed(5));
    return roundedNumber;
  }

  function calculateCryptoDynamicValue(crypto, amount, price) {
    return amount * price;
  }

  function updateCryptoAmount(crypto, value) {
    const newCryptoAmounts = { ...cryptoAmounts, [crypto]: value };
    setCryptoAmounts(newCryptoAmounts);

    // Get the current price for the cryptocurrency
    const currentPrice = cryptoPrices[crypto];

    // Calculate dynamic value and update state
    const dynamicValue = calculateCryptoDynamicValue(
      crypto,
      value,
      currentPrice
    );
    setCryptoDynamicValues({ ...cryptoDynamicValues, [crypto]: dynamicValue });
  }

  function buyBTC() {
    if (window.confirm(`Are you sure you want to buy ${cryptoAmounts.BTC} BTC?`)) {
      const requestData = {
        btcAmount: Number(cryptoAmounts.BTC),
        btcPrice: Number(cryptoPrices.BTC),
      };
  
      const options = {
        method: "POST",
        body: JSON.stringify(requestData),
        credentials: "include",
      };
  
      fetch("/buyBTC", options)
        .then((res) => res.json())
        .then((apiRes) => {
          console.log(apiRes);
          setCryptoAmounts({ ...cryptoAmounts, BTC: "" });
          setCryptoPrices({ ...cryptoPrices, BTC: "" });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  

  function sellBTC() {
    if (window.confirm(`Are you sure you want to sell ${cryptoAmounts.BTC} BTC?`)) {
      const requestData = {
        btcAmount: Number(cryptoAmounts.BTC),
        btcPrice: Number(cryptoPrices.BTC),
      };
  
      const options = {
        method: "POST",
        body: JSON.stringify(requestData),
        credentials: "include",
      };
  
      fetch("/sellBTC", options)
        .then((res) => res.json())
        .then((apiRes) => {
          console.log(apiRes);
          setCryptoAmounts({ ...cryptoAmounts, BTC: "" });
          setCryptoPrices({ ...cryptoPrices, BTC: "" });
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  

  function buyETH() {
    if (window.confirm(`Are you sure you want to buy ${cryptoAmounts.ETH} ETH?`)) {
      const requestData = {
        ethAmount: Number(cryptoAmounts.ETH),
        ethPrice: Number(cryptoPrices.ETH),
      };

    const options = {
      method: "POST",
      body: JSON.stringify(requestData),
      credentials: "include",
    };

    fetch("/buyETH", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setCryptoAmounts({ ...cryptoAmounts, ETH: "" });
        setCryptoPrices({ ...cryptoPrices, ETH: "" });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  function sellETH() {
    if (window.confirm(`Are you sure you want to sell ${cryptoAmounts.ETH} ETH?`)) {
      const requestData = {
        ethAmount: Number(cryptoAmounts.ETH),
        ethPrice: Number(cryptoPrices.ETH),
      };

    const options = {
      method: "POST",
      body: JSON.stringify(requestData),
      credentials: "include",
    };

    fetch("/sellETH", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setCryptoAmounts({ ...cryptoAmounts, ETH: "" });
        setCryptoPrices({ ...cryptoPrices, ETH: "" });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  function buyLTC() {
    if (window.confirm(`Are you sure you want to buy ${cryptoAmounts.LTC} LTC?`)) {
      const requestData = {
        ltcAmount: Number(cryptoAmounts.LTC),
        ltcPrice: Number(cryptoPrices.LTC),
      };

    const options = {
      method: "POST",
      body: JSON.stringify(requestData),
      credentials: "include",
    };

    fetch("/buyLTC", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setCryptoAmounts({ ...cryptoAmounts, LTC: "" });
        setCryptoPrices({ ...cryptoPrices, LTC: "" });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  function sellLTC() {
    if (window.confirm(`Are you sure you want to sell ${cryptoAmounts.LTC} LTC?`)) {
      const requestData = {
        ltcAmount: Number(cryptoAmounts.LTC),
        ltcPrice: Number(cryptoPrices.LTC),
      };

    const options = {
      method: "POST",
      body: JSON.stringify(requestData),
      credentials: "include",
    };

    fetch("/sellLTC", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setCryptoAmounts({ ...cryptoAmounts, LTC: "" });
        setCryptoPrices({ ...cryptoPrices, LTC: "" });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  function buyDOGE() {
    if (window.confirm(`Are you sure you want to buy ${cryptoAmounts.DOGE} DOGE?`)) {
      const requestData = {
        dogeAmount: Number(cryptoAmounts.DOGE),
        dogePrice: Number(cryptoPrices.DOGE),
      };

    const options = {
      method: "POST",
      body: JSON.stringify(requestData),
      credentials: "include",
    };

    fetch("/buyDOGE", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setCryptoAmounts({ ...cryptoAmounts, DOGE: "" });
        setCryptoPrices({ ...cryptoPrices, DOGE: "" });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  function sellDOGE() {
    if (window.confirm(`Are you sure you want to sell ${cryptoAmounts.DOGE} DOGE?`)) {
      const requestData = {
        dogeAmount: Number(cryptoAmounts.DOGE),
        dogePrice: Number(cryptoPrices.DOGE),
      };

    const options = {
      method: "POST",
      body: JSON.stringify(requestData),
      credentials: "include",
    };

    fetch("/sellDOGE", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setCryptoAmounts({ ...cryptoAmounts, DOGE: "" });
        setCryptoPrices({ ...cryptoPrices, DOGE: "" });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  function buyXLM() {
    if (window.confirm(`Are you sure you want to buy ${cryptoAmounts.XLM} XLM?`)) {
      const requestData = {
        xlmAmount: Number(cryptoAmounts.XLM),
        xlmPrice: Number(cryptoPrices.XLM),
      };

    const options = {
      method: "POST",
      body: JSON.stringify(requestData),
      credentials: "include",
    };

    fetch("/buyXLM", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setCryptoAmounts({ ...cryptoAmounts, XLM: "" });
        setCryptoPrices({ ...cryptoPrices, XLM: "" });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  function sellXLM() {
    if (window.confirm(`Are you sure you want to sell ${cryptoAmounts.XLM} XLM?`)) {
      const requestData = {
        xlmAmount: Number(cryptoAmounts.XLM),
        xlmPrice: Number(cryptoPrices.XLM),
      };

    const options = {
      method: "POST",
      body: JSON.stringify(requestData),
      credentials: "include",
    };

    fetch("/sellXLM", options)
      .then((res) => res.json())
      .then((apiRes) => {
        console.log(apiRes);
        setCryptoAmounts({ ...cryptoAmounts, XLM: "" });
        setCryptoPrices({ ...cryptoPrices, XLM: "" });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  // Function to determine whether to display up or down arrow
  function determineArrowDirection(crypto, averagePrice) {
    const currentPrice = cryptoPrices[crypto];
    return currentPrice > averagePrice ? "up" : "down";
  }

  React.useEffect(() => {
    setCryptoPrices({
      BTC: generateRandomPrice(50000, 70000),
      ETH: generateRandomPrice(3000, 5000),
      LTC: generateRandomPrice(150, 250),
      DOGE: generateRandomPrice(0.2, 0.5),
      XLM: generateRandomPrice(0.3, 0.7),
    });
    fetchUserInfo();
  }, []);

  if (shouldRedirect) {
    return <Navigate to="/Transactions" replace={true} />;
  } 
 


  return (
    <div className="HomePage">
    <header className="HomePage-header">
      <img src="logo2.png" className="HomePage-logo" alt="logo" />
      <h1 id="welcomeMessage">Welcome to your vault {userInfo.userName}</h1>
      <div className="logout" onClick={Logout}>
        <FontAwesomeIcon icon={faArrowRight} className="header-arrow" />
        <span className="logout-text">Logout</span>
      </div>
      </header>
      <main>
        <div className="content">
          <div className="block1">
            <div className="info">
              <h1>Account Balance</h1>
              <h1
                id="number"
                className={balanceUpdated ? "balance-updated" : ""}
              >
                ${" "}
                <CountUp
                  start={100}
                  end={userInfo.balance.toFixed(3)}
                  duration={1.5}
                  decimals={3} // Add this line to specify the number of decimals
                />
              </h1>{" "}
              <h2 onClick={() => setShouldRedirect(true)}>View transactions</h2>
              

            </div>
            <div className="actions">
              <div className="dropdown-btn">
                <h1>Actions</h1>
                <div className="dropdown-content">
                  <a onClick={() => handleActionClick("Withdraw")}>Withdraw</a>
                  <a onClick={() => handleActionClick("Deposit")}>Deposit</a>
                  <a onClick={() => handleActionClick("Transfer")}>Transfer</a>
                  <a onClick={() => setShouldRedirect(true)}>Account History</a>
                  <a onClick={() => setShouldRedirect(true)}>Contacts List</a>
                  
                </div>
              </div>
            </div>
            <div className="actionInfo">
              <div
                className={`withdraw ${
                  selectedAction === "Withdraw" ? "visible" : ""
                }`}
              >
                <h1>Withdraw</h1>
                <div id="inner">
                  <FormControl
                    sx={{ width: "13rem" }} // Adjust the width as needed
                    variant="filled"
                  >
                    {" "}
                    <InputLabel htmlFor="filled-adornment-amount">
                      Amount
                    </InputLabel>
                    <FilledInput
                      id="filled-adornment-amount"
                      value={amount}
                      onChange={updateAmount}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </FormControl>

                  <Button id="button" variant="outlined" onClick={withdraw}>
                    Submit
                  </Button>
                </div>
              </div>
              <div
                className={`deposit ${
                  selectedAction === "Deposit" ? "visible" : ""
                }`}
              >
                <h1>Deposit</h1>
                <div id="inner">
                  <FormControl
                    sx={{ width: "13rem" }} // Adjust the width as needed
                    variant="filled"
                  >
                    {" "}
                    <InputLabel htmlFor="filled-adornment-amount">
                      Amount
                    </InputLabel>
                    <FilledInput
                      id="filled-adornment-amount"
                      value={amount}
                      onChange={updateAmount}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                    />
                  </FormControl>

                  <Button id="button" variant="outlined" onClick={deposit}>
                    Submit
                  </Button>
                </div>
              </div>
              <div
                className={`transfer ${
                  selectedAction === "Transfer" ? "visible" : ""
                }`}
              >
                <h1>Transfer</h1>
                <div id="inner">
                  <div id="transferInfo">
                    <FormControl
                      sx={{ width: "13rem" }} // Adjust the width as needed
                      variant="filled"
                    >
                      {" "}
                      <InputLabel htmlFor="filled-adornment-amount">
                        Amount
                      </InputLabel>
                      <FilledInput
                        id="filled-adornment-amount"
                        value={amount}
                        onChange={updateAmount}
                        startAdornment={
                          <InputAdornment position="start">$</InputAdornment>
                        }
                      />
                    </FormControl>
                    <FormControl
                      sx={{ width: "13rem" }} // Adjust the width as needed
                      variant="filled"
                    >
                      {" "}
                      <InputLabel
                        htmlFor="filled-adornment-amount"
                        value={toId}
                        onChange={updateToId}
                      >
                        Recipient Account ID
                      </InputLabel>
                      <FilledInput
                        id="filled-adornment-amount"
                        value={toId}
                        onChange={updateToId}
                        startAdornment={
                          <InputAdornment position="start">#</InputAdornment>
                        }
                      />
                    </FormControl>
                  </div>

                  <Button id="button" variant="outlined" onClick={transfer}>
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="block2">
            <h1>Crypto Wallet</h1>
            <div className="cryptos">
              <div className="crypto">
                <h1>BITCOIN</h1>
                <h1>{userInfo.BTC} BTC</h1>
                <div id="cryptoActions">
                  <TextField
                    id="filled-number"
                    label="Amount"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="filled"
                    sx={{
                      width: "70%", // Adjust the width as needed
                    }}
                    onChange={(event) =>
                      updateCryptoAmount("BTC", event.target.value)
                    }
                  />
                  <div id="buySell">
                    <button id="buy" onClick={buyBTC}>BUY</button>
                    <button id="sell" onClick={sellBTC}>SELL</button>
                  </div>
                </div>
                <div id="price">
                  <h2>Current Price: $ {cryptoPrices.BTC}</h2>
                  {determineArrowDirection("BTC", 60000) === "up" ? (
                    <FontAwesomeIcon id="arrowup" icon={faArrowTrendUp} />
                  ) : (
                    <FontAwesomeIcon id="arrowdown" icon={faArrowTrendDown} />
                  )}
                </div>
                <h2>VALUE: $ {cryptoDynamicValues.BTC.toFixed(4)}</h2>
              </div>
              <div className="crypto">
                <h1>ETHERIUM</h1>
                <h1>{userInfo.ETH} ETH</h1>
                <div id="cryptoActions">
                  <TextField
                    id="filled-number"
                    label="Amount"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="filled"
                    sx={{
                      width: "70%", // Adjust the width as needed
                    }}
                    onChange={(event) =>
                      updateCryptoAmount("ETH", event.target.value)
                    }
                  />
                  <div id="buySell">
                    <button id="buy" onClick={buyETH}>BUY</button>
                    <button id="sell" onClick={sellETH}>SELL</button>
                  </div>
                </div>
                <div id="price">
                  <h2>Current Price: $ {cryptoPrices.ETH}</h2>
                  {determineArrowDirection("ETH", 4000) === "up" ? (
                    <FontAwesomeIcon id="arrowup" icon={faArrowTrendUp} />
                  ) : (
                    <FontAwesomeIcon id="arrowdown" icon={faArrowTrendDown} />
                  )}
                </div>
                <h2>VALUE: $ {cryptoDynamicValues.ETH.toFixed(4)}</h2>
              </div>
              <div className="crypto">
                <h1>LITECOIN</h1>
                <h1>{userInfo.LTC} LTC</h1>
                <div id="cryptoActions">
                  <TextField
                    id="filled-number"
                    label="Amount"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="filled"
                    sx={{
                      width: "70%", // Adjust the width as needed
                    }}
                    onChange={(event) =>
                      updateCryptoAmount("LTC", event.target.value)
                    }
                  />
                  <div id="buySell">
                    <button id="buy" onClick={buyLTC}>BUY</button>
                    <button id="sell" onClick={sellLTC}>SELL</button>
                  </div>
                </div>
                <div id="price">
                  <h2>Current Price: $ {cryptoPrices.LTC}</h2>
                  {determineArrowDirection("LTC", 200) === "up" ? (
                    <FontAwesomeIcon id="arrowup" icon={faArrowTrendUp} />
                  ) : (
                    <FontAwesomeIcon id="arrowdown" icon={faArrowTrendDown} />
                  )}
                </div>
                <h2>VALUE: $ {cryptoDynamicValues.LTC.toFixed(4)}</h2>
              </div>
              <div className="crypto">
                <h1>DOGECOIN</h1>
                <h1>{userInfo.DOGE} DOGE</h1>
                <div id="cryptoActions">
                  <TextField
                    id="filled-number"
                    label="Amount"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="filled"
                    sx={{
                      width: "70%", // Adjust the width as needed
                    }}
                    onChange={(event) =>
                      updateCryptoAmount("DOGE", event.target.value)
                    }
                  />
                  <div id="buySell">
                    <button id="buy" onClick={buyDOGE}>BUY</button>
                    <button id="sell" onClick={sellDOGE}>SELL</button>
                  </div>
                </div>
                <div id="price">
                  <h2>Current Price: $ {cryptoPrices.DOGE}</h2>
                  {determineArrowDirection("DOGE", 0.35) === "up" ? (
                    <FontAwesomeIcon id="arrowup" icon={faArrowTrendUp} />
                  ) : (
                    <FontAwesomeIcon id="arrowdown" icon={faArrowTrendDown} />
                  )}
                </div>
                <h2>VALUE: $ {cryptoDynamicValues.DOGE.toFixed(4)}</h2>
              </div>
              <div className="crypto">
                <h1>STELLAR</h1>
                <h1>{userInfo.XLM} XLM</h1>
                <div id="cryptoActions">
                  <TextField
                    id="filled-number"
                    label="Amount"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="filled"
                    sx={{
                      width: "70%", // Adjust the width as needed
                    }}
                    onChange={(event) =>
                      updateCryptoAmount("XLM", event.target.value)
                    }
                  />
                  <div id="buySell">
                    <button id="buy" onClick={buyXLM}>BUY</button>
                    <button id="sell" onClick={sellXLM}>SELL</button>
                  </div>
                </div>
                <div id="price">
                  <h2>Current Price: $ {cryptoPrices.XLM}</h2>
                  {determineArrowDirection("XLM", 0.5) === "up" ? (
                    <FontAwesomeIcon id="arrowup" icon={faArrowTrendUp} />
                  ) : (
                    <FontAwesomeIcon id="arrowdown" icon={faArrowTrendDown} />
                  )}
                </div>
                <h2>VALUE: $ {cryptoDynamicValues.XLM.toFixed(4)}</h2>
              </div>
            </div>
          </div>

          {/* <h1>Home Page</h1>
          $<input value={amount} onChange={updateAmount} />
          TO: <input value={toId} onChange={updateToId} />
          <button onClick={deposit}>Deposit</button>
          <button onClick={withdraw}>Withdraw</button>
          <button onClick={transfer}>Transfer</button>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>ID</th>
                <th>From user</th>
                <th>To user</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr>
                  <td>{transaction.transactionType}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.uniqueId}</td>
                  <td>{transaction.userId}</td>
                  <td>{transaction.toId}</td>
                </tr>
              ))}
            </tbody>
          </table> */}
        </div>
      </main>
    </div>
  );
}
