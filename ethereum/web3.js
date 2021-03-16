import Web3 from 'web3';

//const web3 = new Web3(window.web3.currentProvider); 
//Above line assumes web3 instance has already been injected on page, 
//doesnt work with Next.js since it does server side rendering
//DONT USE

let web3;

if ((typeof(window) !== 'undefined') && (typeof(window.web3) !== 'undefined')) { 
//Check if running in browser and if Metamask has injected web3
    web3 = new Web3(window.web3.currentProvider); 
} else {
    //On server or user is not running metamask
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/e92a66fdade34795868c6f2dff971cf6');
    web3 = new Web3(provider);
}

export default web3;