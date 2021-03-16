pragma solidity >=0.4.26;

contract CampaignFactory {
    address[] deployedCampaigns;
    
    function createCampaign(uint min) public{
        address newCampaign = new Campaign(min, msg.sender); //creation of new campaigns contract return address to contract
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
        
    }
    
    address public manager;
    uint public minContrib;
    uint public approversCount;
    
    mapping(address => bool) public approvers;
    Request[] public requests;
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint min, address creator) public{
        manager = creator;
        minContrib = min;
        approversCount = 0;

    }
    
    function contribute() payable public{
        require(msg.value > minContrib);
        
        approvers[msg.sender] = true; //Adds new key to approvers mapping
        approversCount++;
        
    }
    
    //Only manager should be able to call this
    function createRequest(string description, uint value, address recipient) 
        public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        
        requests.push(newRequest);
            
    }
    
    
    function approveRequest(uint index) public{
        Request storage request = requests[index];
        
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;

    }
    
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        
        require(request.approvalCount > (approversCount/2));
        require(!request.complete);
        
        request.recipient.transfer(request.value);
        
        request.complete = true;
        
    }

    function getSummary() public view returns(
        uint, uint, uint, uint, address
        )   {
            return(
                minContrib,
                address(this).balance,
                requests.length,
                approversCount,
                manager
            );
    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    }
  
}