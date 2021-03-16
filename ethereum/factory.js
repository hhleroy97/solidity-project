import web3 from './web3'; //Instance of web3 from web3.js not package
import CampaignFactory from './build/CampaignFactory.json';

console.log(CampaignFactory);

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface),'0x85E2d7962a2f08B7B1F48C00fe5ceDF80d31b29F');

export default instance;
