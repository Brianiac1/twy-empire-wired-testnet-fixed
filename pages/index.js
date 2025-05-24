import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../presaleABI.json";

const PRESALE_ADDRESS = "0xC4259173a89D280385F5421dC9dB0B1ff11Fe6b1";

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [txStatus, setTxStatus] = useState("");

  useEffect(() => {
    if (wallet && provider) {
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(PRESALE_ADDRESS, abi, signer);
      setContract(contractInstance);
    }
  }, [wallet, provider]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask");
    const _provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await _provider.getSigner();
    const address = await signer.getAddress();
    setWallet(address);
    setProvider(_provider);
  };

  const buyWithETH = async () => {
    try {
      setTxStatus("Processing ETH buy...");
      const tx = await contract.buyWithETH({ value: ethers.parseEther("0.01") });
      await tx.wait();
      setTxStatus("✅ ETH Purchase successful!");
    } catch (err) {
      setTxStatus("❌ ETH Transaction failed.");
    }
  };

  const buyWithUSDC = async () => {
    try {
      setTxStatus("Processing USDC buy...");
      const tx = await contract.buyWithUSDC();
      await tx.wait();
      setTxStatus("✅ USDC Purchase successful!");
    } catch (err) {
      setTxStatus("❌ USDC Transaction failed.");
    }
  };

  const claimTokens = async () => {
    try {
      setTxStatus("Claiming tokens...");
      const tx = await contract.claimTokens();
      await tx.wait();
      setTxStatus("✅ Claim successful!");
    } catch (err) {
      setTxStatus("❌ Claim failed.");
    }
  };

  return (
    <div style={{ backgroundColor: 'black', color: 'gold', minHeight: '100vh', padding: '2rem', textAlign: 'center' }}>
      <img src="/token.png" alt="$TWY" style={{ width: 180, marginBottom: '1.5rem' }} />
      <h1>$TWY Web3 Empire</h1>
      <p>Say hello to The World, Chico... and Everything in it.</p>
      <button onClick={connectWallet} style={{ padding: '12px 24px', marginTop: '1.5rem' }}>Connect Wallet</button>
      {wallet && (
        <>
          <p style={{ marginTop: '1rem' }}>Connected: {wallet}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={buyWithETH} style={{ padding: '12px 24px' }}>Buy with ETH</button>
            <button onClick={buyWithUSDC} style={{ padding: '12px 24px' }}>Buy with USDC</button>
          </div>
          <button onClick={claimTokens} style={{ marginTop: '2rem', padding: '12px 24px' }}>Claim Tokens</button>
        </>
      )}
      <p style={{ marginTop: '1rem', color: 'white' }}>{txStatus}</p>
    </div>
  );
}
