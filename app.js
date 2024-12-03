// Importazione di Solana Web3 (se non già disponibile globalmente)
const solanaWeb3 = window.solanaWeb3 || require('@solana/web3.js');

// Connessione alla Devnet
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'), 'confirmed');

// Elementi DOM
const connectWalletButton = document.getElementById('connect-wallet');
const walletAddressDisplay = document.getElementById('wallet-address');
const amountInput = document.getElementById('amount');
const amountError = document.getElementById('amount-error');
const submitTransactionButton = document.getElementById('submit-transaction');

// Variabile per salvare l'indirizzo del wallet
let walletPublicKey = null;

// Funzione per connettere Phantom Wallet
connectWalletButton.addEventListener('click', async () => {
  try {
    if (!window.solana || !window.solana.isPhantom) {
      alert("Assicurati di avere Phantom Wallet installato.");
      return;
    }

    // Connessione a Phantom
    const wallet = await window.solana.connect();
    walletPublicKey = wallet.publicKey;
    walletAddressDisplay.textContent = `Wallet: ${walletPublicKey.toString()}`;
    console.log("Wallet connesso:", walletPublicKey.toString());

    // Abilita il pulsante di transazione
    submitTransactionButton.disabled = false;
  } catch (err) {
    console.error("Errore nella connessione al wallet:", err);
  }
});

// Funzione per inviare la transazione
submitTransactionButton.addEventListener('click', async () => {
  try {
    // Ottieni la quantità dall'input
    const amount = parseInt(amountInput.value, 10);

    // Validazione della quantità
    if (isNaN(amount) || amount < 1000 || amount > 10000000) {
      amountError.style.display = 'block';
      return;
    } else {
      amountError.style.display = 'none';
    }

    // Converti l'importo in lamports (1 SOL = 1,000,000,000 lamports)
    const lamports = amount * 1000000; // 1 SCC = 1 lamport

    // Indirizzo della tesoreria (modifica con il tuo)
    const treasuryPublicKey = new solanaWeb3.PublicKey('5ZgZuZNTb3vH7pEq36d9pDyHATcmSf2obD4HbfRagHqx');

    // Crea la transazione
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: walletPublicKey,
        toPubkey: treasuryPublicKey,
        lamports,
      })
    );

    // Aggiunge recentBlockhash e fee-payer
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = walletPublicKey;

    // Firma la transazione
    const signedTransaction = await window.solana.signTransaction(transaction);
    console.log("Transazione firmata:", signedTransaction);

    // Invia la transazione
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    console.log("Transazione inviata, signature:", signature);

    // Conferma la transazione
    await connection.confirmTransaction(signature);
    alert("Transazione completata con successo!");
  } catch (err) {
    console.error("Errore nella transazione:", err);
    alert("Transazione fallita. Controlla la console per i dettagli.");
  }
});
