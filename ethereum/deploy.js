const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
    'toy service plug addict blouse area orphan toe must print rely country', 
    'https://rinkeby.infura.io/v3/e92a66fdade34795868c6f2dff971cf6',0,3
);

const web3 = new Web3(provider);

const deploy = async () =>{
    const accounts = await web3.eth.getAccounts();
    const testAcct = accounts[0];
    console.log('Attempting to deploy from account', testAcct);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: testAcct});

    console.log('Contract deployed to', result.options.address);
};

deploy();