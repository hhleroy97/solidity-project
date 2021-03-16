const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');


let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () =>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data:compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0], //Campaign manager
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //Destructuring of an array syntax

    //Below code works with already deployed contract
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface), 
        campaignAddress
    );

});

describe('Campaigns', ()=> {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as campaign manager', async ()=>{
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);
    });

    it('allows people to contribute money and marks them as approvers', async ()=>{
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContrib = await campaign.methods.approvers(accounts[1]).call();
        assert(isContrib);
    });

    it('requires minimum contribution', async ()=>{
        try{
            await campaign.methods.contribute().send({
                value:'5',
                from: accounts[1]
            });

            assert(false);

        } catch (err) {
            assert(err);
        }
    });

    it('manager can create payment request', async ()=>{
        await campaign.methods
            .createRequest('Buy Batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        const req = await campaign.methods.requests(0).call();

        assert.equal('Buy Batteries', req.description);
    });

    //End to End test
    it('processes request', async ()=>{
        //Contribute to campaign
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        //Create request
        await campaign.methods
            .createRequest('Buy Batteries', web3.utils.toWei('5', 'ether') , accounts[1])
            .send({from: accounts[0],gas: '1000000'});

        //Need to vote prior to approval
        await campaign.methods.approveRequest(0).send({from:accounts[0],gas:'1000000'});

        //Finalize req
        await campaign.methods.finalizeRequest(0).send({from:accounts[0],gas:'1000000'});
        
        //Retrieve balance of account
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104); //Somewhat arb amount should be more robust in actual test
    });

});

