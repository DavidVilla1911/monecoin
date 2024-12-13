// Connessione alla Devnet
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

// Elementi DOM
const connectWalletButton = document.getElementById('connect-wallet');
const walletAddressDisplay = document.getElementById('wallet-address');
const purchaseForm = document.getElementById('purchase-form');
const amountInput = document.getElementById('amount');
const amountError = document.getElementById('amount-error');
const submitTransactionButton = document.getElementById('submit-transaction');

// Variabile per salvare l'indirizzo del wallet
let walletPublicKey = null;

// Funzione per connettere Phantom Wallet
connectWalletButton.addEventListener('click', async () => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      alert("Phantom Wallet non è installato. Scaricalo da https://phantom.app");
      return;
    }

    // Connessione al wallet Phantom
    const wallet = await window.solana.connect({ onlyIfTrusted: false });
    walletPublicKey = wallet.publicKey;
    walletAddressDisplay.textContent = `Wallet: ${walletPublicKey.toString()}`;
    console.log("Wallet connesso:", walletPublicKey.toString());

    // Mostra il modulo di acquisto
    purchaseForm.classList.remove('hidden');
    submitTransactionButton.disabled = false;
  } catch (err) {
    console.error("Errore nella connessione al wallet:", err);
    alert("Errore durante la connessione al wallet.");
  }
});

// Funzione per inviare la transazione
submitTransactionButton.addEventListener('click', async () => {
  try {
    const amount = parseInt(amountInput.value, 10);
    if (isNaN(amount) || amount < 1000 || amount > 10000000) {
      amountError.classList.remove('hidden');
      return;
    }
    amountError.classList.add('hidden');

    const lamports = amount * 1000000; // Converti SCC in lamports (1 SCC = 1_000_000 lamports)
    const treasuryPublicKey = new solanaWeb3.PublicKey('5ZgZuZNTb3vH7pEq36d9pDyHATcmSf2obD4HbfRagHqx');
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: treasuryPublicKey,
        lamports,
      })
    );

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPublicKey;

    // Firma e invia la transazione
    const signedTransaction = await window.solana.signTransaction(transaction);
    const serializedTransaction = signedTransaction.serialize();
    const signature = await connection.sendRawTransaction(serializedTransaction);
    await connection.confirmTransaction(signature);

    alert("Transazione completata con successo!");
  } catch (err) {
    console.error("Errore durante la transazione:", err);
    alert("Transazione fallita. Controlla i log della console per maggiori dettagli.");
  }
});
