import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

import { getTokenVesting, getSimpleToken } from '../contracts'

import Header from './Header'
import VestingDetails from './VestingDetails'
import VestingSchedule from './VestingSchedule'
import Spinner from './Spinner'

import '../stylesheets/TokenVestingApp.css'


class TokenVestingApp extends Component {
  constructor() {
    super()
    this.state = { name: 'Token', loading: true }
  }

  componentDidMount() {
    this.getData()
  }

  render() {
    console.log("TokenVestingApp", this.props)
    const { address, token, holder } = this.props
    return (
      <div className="TokenVestingApp">

        { this.state.loading ? <Spinner /> : null }

        <Header address={ address } token={ token } tokenName={ this.state.name } />

        <Grid>
          <Row>
            <Col xs={12} md={6}>
              <VestingDetails
                address={ address }
                token={ token }
                holder = { holder }
                details={ this.state }
                getData={ () => this.getData() }
                setLoader={ x => this.setLoader(x) }
              />
            </Col>

            <Col xs={12} md={6}>
              <VestingSchedule
                details={ this.state }
                address={ address }
                holder={ holder } />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }

  setLoader(loading) {
    this.setState({ loading })
  }

  async getData() {
    const { address, token, holder } = this.props

    const tokenVesting = await getTokenVesting(address)
    const tokenContract = await getSimpleToken(token)

    const grant = await tokenVesting.grants(holder);

    const start = grant[1]
    const end = grant[3]

    const balance  = await tokenContract.balanceOf(address)
    // const released = await tokenVesting.released(token)
    const total = grant[0] // balance.plus(released)
    const released = grant[5]

    this.setState({
      start,
      end,
      cliff: grant[2], //await tokenVesting.cliff(),
      total,
      released,
      vested: grant[0], //await tokenVesting.vestedAmount(token),
      decimals: await tokenContract.DECIMALS(),
      beneficiary: holder,
      owner: await tokenVesting.owner(),
      revocable: grant[6],
      revoked: false,
      name: await tokenContract.NAME(),
      symbol: await tokenContract.SYMBOL(),
      loading: false
    })
  }
}


export default TokenVestingApp
