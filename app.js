<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presale SCC</title>
  <script src="https://cdn.jsdelivr.net/npm/@solana/web3.js/lib/index.iife.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      margin-top: 50px;
    }
    .hidden {
      display: none;
      color: red;
      font-size: 14px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
    }
    input {
      padding: 10px;
      font-size: 16px;
      width: 200px;
    }
  </style>
</head>
<body>
  <h1>SCC Token Presale</h1>
  <button id="connect-wallet">Connect Wallet</button>
  <p id="wallet-address"></p>

  <div id="purchase-form" class="hidden">
    <h3>Enter the amount of SCC tokens to purchase:</h3>
    <input type="number" id="amount" placeholder="Enter amount (1000 - 10M)" />
    <p id="amount-error" class="hidden">Please enter a valid amount between 1000 and 10,000,000.</p>
    <button id="submit-transaction" disabled>Submit Transaction</button>
  </div>

  <script src="app.js"></script>
</body>
</html>
