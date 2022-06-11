import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import  EthersAdapter  from '@gnosis.pm/safe-ethers-lib';
import Safe, {SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk';



async function initialize() {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const safeOwner = provider.getSigner(0)
  
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: safeOwner
  })
  const safeFactory = await SafeFactory.create({ ethAdapter })
  const owners = ['0xF13B2D406f0D3F9C6c81bC525ED33Fe70B434870', '0x1c02977fE0BDbD27ef28d6b7eed0854Aa53425b6']
  const threshold = 1
  const safeAccountConfig: SafeAccountConfig = {
  owners,
  threshold,
  }

  const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig })
  const newSafeAddress = safeSdk.getAddress()
  console.log(newSafeAddress)

}


function App() {
  initialize()
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
