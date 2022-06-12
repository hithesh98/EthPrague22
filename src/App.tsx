import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import  EthersAdapter  from '@gnosis.pm/safe-ethers-lib';
import Safe, {SafeFactory, SafeAccountConfig } from '@gnosis.pm/safe-core-sdk';
import { Button, Form, Header, Container } from 'semantic-ui-react';


// Creates a new safe 
async function initialize(data: any) {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const safeOwner = provider.getSigner(0)
  const address = await safeOwner.getAddress();
  
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: safeOwner
  })
  const safeFactory = await SafeFactory.create({ ethAdapter })
  const _data = JSON.parse(data);
  const owners = [address, _data.firstAdd, _data.secondAdd]
  const threshold = 1
  const safeAccountConfig: SafeAccountConfig = {
  owners,
  threshold,
  }

  const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig })
  const newSafeAddress = safeSdk.getAddress()
  console.log(newSafeAddress)

}

// Gets a sdk reference to an existing safe
async function existingSafe() {
  let provider = new ethers.providers.Web3Provider(window.ethereum);
  const safeOwner = provider.getSigner(0)
  
  const ethAdapter = new EthersAdapter({
    ethers,
    signer: safeOwner,

  }) 
 
  const safeAddress = '0x85496C126B99c5834e8f26573B9A1D800ff0cd23'
  const safeSdk: Safe = await Safe.create({ethAdapter, safeAddress })

  console.log(safeSdk)

}

function App() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState("");

  return (
    <div>
    <Container text>
      <Header as='h1'>Algoshare</Header>
      <p>Create a Gnosis Safe for your data science project, share profits from deploying to algorithm marketplaces.</p>
      <Form onSubmit={handleSubmit((data) => initialize(JSON.stringify(data)))}>
      <Form.Field>
        <input {...register("firstAdd")} placeholder="First additional address" />
      </Form.Field>
      <Form.Field>
        <input {...register("secondAdd")} placeholder="Second additional address" />
      </Form.Field>
      <Button type='submit'>Deploy Safe</Button>
      </Form>
    </Container>
    <Container>
      <Header as='h3'>Specify Profit Share Split</Header>
      <p>Algoshare uses 0xSplits to disburse funds between contributors to your project.</p>
      <Form>
        <Form.Field>
          <input type="text" pattern="[0-9]*" placeholder='Safe Creator Profit Share Percentage' />
        </Form.Field>
        <Form.Field>
          <input type="text" pattern="[0-9]*" placeholder='First Contributor Profit Share Percentage' />
        </Form.Field>
        <Form.Field>
          <input type="text" pattern="[0-9]*" placeholder='Second Contributor Profit Share Percentage' />
        </Form.Field>
      </Form>
      <Button type='submit'>Set Profit Sharing</Button>
    </Container>
    </div>
  );
  // initialize()
}

export default App;