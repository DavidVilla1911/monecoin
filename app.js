document.addEventListener("DOMContentLoaded", async () => {
  const connectButton = document.getElementById("connectButton");
  const walletAddress = document.getElementById("walletAddress");
  const purchaseInfo = document.getElementById("purchaseInfo");
  const amountSection = document.getElementById("amountSection");
  const amountInput = document.getElementById("amountInput");
  const errorMessage = document.getElementById("errorMessage");
  const buyButton = document.getElementById("buyButton");
  const transactionResult = document.getElementById("transactionResult");

  const PROGRAM_ID = "dRxFhMb8nojoWBLLRKMUHypwhHJYQ8AznUqn9S7d64v";
  const TREASURY_WALLET = "5ZgZuZNTb3vH7pEq36d9pDyHATcmSf2obD4HbfRagHqx";
  const SCC_PRICE = 0.0001; // 1 SCC = 0.0001 SOL
  const MIN_SCC = 1000;
  const MAX_SCC = 10000000;

  let wallet;

  // Connessione al wallet Phantom
  connectButton.addEventListener("click", async () => {
    try {
      const provider = window.solana;

      if (!provider || !provider.isPhantom) {
        alert("Phantom Wallet non rilevato! Installalo per continuare.");
        return;
      }

      // Connetti il wallet
      const response = await provider.connect();
      wallet = response.publicKey.toString();
      walletAddress.textContent = `Wallet Connesso: ${wallet}`;
      purchaseInfo.style.display = "block";
      amountSection.style.display = "block";
      buyButton.style.display = "inline-block";
    } catch (err) {
      console.error("Errore nella connessione:", err);
      alert("Errore nella connessione al wallet!");
    }
  });

  // Acquista token
  buyButton.addEventListener("click", async () => {
    transactionResult.textContent = ""; // Pulisci i risultati precedenti
    errorMessage.style.display = "none";

    if (!wallet) {
      alert("Connetti il tuo wallet prima di continuare.");
      return;
    }

    // Validazione della quantità inserita
    const amount = parseInt(amountInput.value, 10);
    if (isNaN(amount) || amount < MIN_SCC || amount > MAX_SCC) {
      errorMessage.style.display = "block";
      return;
    }

    // Calcolo del costo in SOL
    const costInSol = amount * SCC_PRICE;

    try {
      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl("devnet"),
        "confirmed"
      );

      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: new solanaWeb3.PublicKey(wallet),
          toPubkey: new solanaWeb3.PublicKey(TREASURY_WALLET),
          lamports: solanaWeb3.LAMPORTS_PER_SOL * costInSol, // Converti SOL in lamport
        })
      );

      // Richiedi firma e invia la transazione
      const { signature } = await window.solana.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature);

      transactionResult.textContent = `Transazione riuscita! Hai acquistato ${amount} SCC. Signature: ${signature}`;
      transactionResult.style.color = "green";
    } catch (err) {
      console.error("Errore nella transazione:", err);
      transactionResult.textContent = "Transazione fallita!";
      transactionResult.style.color = "red";
    }
  });
});
