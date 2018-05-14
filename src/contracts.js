import contract from 'truffle-contract'
import Network from "./network"

export async function getTokenVesting(address) {
  const TokenVesting = contract(require('contracts/SvdVesting.json'))
  const provider = await Network.provider()
  TokenVesting.setProvider(provider)
  return TokenVesting.at(address)
}

export async function getSimpleToken(address) {
  const SimpleToken = contract(require('contracts/SvdToken.json'))
  const provider = await Network.provider()
  SimpleToken.setProvider(provider)
  return SimpleToken.at(address)
}

export async function getVestedAmountAt(address, holder, date) {
  console.log("getVestedAmountAt", address)
  const vesting = await getTokenVesting(address)
  const amount = await vesting.vestedTokens(holder, date)
  return amount; 
}

