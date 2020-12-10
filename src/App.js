import './App.css';
import React from 'react';
import Web3 from "web3";

class App extends React.Component {

  constructor(props) {
    super(props);
    // getting the reference of web3
    this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    //creating a reference of the contract using web3 and pasting the CONTRACT API that we created earlier
    this.contract = new this.web3.eth.Contract(
      [{"constant": true, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}], "name": "approve", "outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "totalSupply", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}], "name": "transferFrom", "outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "INITIAL_SUPPLY", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "decimals", "outputs": [{"name": "", "type": "uint8"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_subtractedValue", "type": "uint256"}], "name": "decreaseApproval", "outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [{"name": "_owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": false, "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}], "name": "transfer", "outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_addedValue", "type": "uint256"}], "name": "increaseApproval", "outputs": [{"name": "", "type": "bool"}], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}], "name": "allowance", "outputs": [{"name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}, {"inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {"indexed": true, "name": "spender", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"}], "name": "Approval", "type": "event"}, {"anonymous": false, "inputs": [{"indexed": true, "name": "from", "type": "address"}, {"indexed": true, "name": "to", "type": "address"}, {"indexed": false, "name": "value", "type": "uint256"}], "name": "Transfer", "type": "event"}]
      ,
      "0x7A32102Ac6592b0578A3d7b59Cc16B4404B24926"
    );
    // initiallizing the state
    this.state = {
      myAccountAddress: "Please LOGIN to Metamask",
      tokenSymbol: "xxx",
      myAccountBalance: 0,
      decimals: 0,
      numberOfTokensToSend: 0,
      addressToSend: "",
      msg: ""
    };

    // Since we are using "this" Keyword in these functions so we need to bind these functions in the constructor.
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentWillMount() {
    this.web3.eth.getAccounts().then(accounts => {

      if (accounts[0]) {

        this.setState({myAccountAddress: accounts[0]});

        // Calling different web3 methods to get BALANCE, SYMBOL, etc
        this.contract.methods.decimals().call().then(decimals => {
          // console.log(decimals);
          this.setState({decimals: decimals});
        });
        this.contract.methods.balanceOf(accounts[0]).call().then(balance => {
          // console.log(balance);

          this.setState({myAccountBalance: balance / (Math.pow(10, this.state.decimals))});
        });
        this.contract.methods.symbol().call().then(symbol => {
          this.setState({tokenSymbol: symbol});
        });

      } else {
        this.setState({myAccountAddress: "You haven't Logged In to Metamask.  "});
      }
    })
  }

  // Function for handling the change in the input field
  handleInputChange(e) {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    // console.log(name + "value has been changed to "+value);
    this.setState({[name]: value});
  }

  // Function to handle form Submission
  handleSubmit(e) {
    e.preventDefault();
    // console.log("Submit button clicked");

    const addressToSend = this.state.addressToSend;
    const decimals = this.state.decimals;
    const numberOfTokensToSend = this.state.numberOfTokensToSend * (Math.pow(10, decimals));
    const addressFrom = this.state.myAccountAddress;

    this.contract.methods.transfer(addressToSend, numberOfTokensToSend).send({from: addressFrom})
      .on('transactionHash', hash => {
        this.setState({msg: "https://rinkeby.etherscan.io/tx/" + hash});
      })
      .on('error', error => {
        this.setState({msg: "Error Occured"});
      })

  }


  render() {


    return (
      <div className="App" id="outer-container">
        <br></br>
        <span id="header">Welcome To Your Dashboard!</span>
        <div id="account-address-container"> Account Address: <span className="account-values">{this.state.myAccountAddress}</span></div>
        <div id="balance-container">Balance: <span className="account-values" id="balance">{this.state.myAccountBalance} {this.state.tokenSymbol}</span></div>
        <div id="form-container">
          <form onSubmit={this.handleSubmit} >
            <label class="input-container">
              Enter Tokens: <input type="number" name="numberOfTokensToSend" value={this.state.numberOfTokensToSend} onChange={this.handleInputChange}></input>
            </label>
            <br></br>
            <label className="input-container">
              Enter Address: <input type="text" name="addressToSend" value={this.state.addressToSend} onChange={this.handleInputChange}></input>
            </label>
            <br></br>
            <input id="submit-btn" type="submit" name="submit"></input>
          </form>
          <br>
          </br>

          <div id="result-container">Result: {(this.state.msg) === "Error Occured" ? (<span>{this.state.msg}</span>) : (<a href={this.state.msg} target="_blank" rel="noreferrer">{this.state.msg}</a>)}</div>


        </div>
      </div>
    );
  }
}

export default App;
