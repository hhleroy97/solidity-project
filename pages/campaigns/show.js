//Component shows user details about specific campaign
import React, {Component} from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import {Link} from'../../routes';

class CampaignShow extends Component{
    static async getInitialProps(props){ //Seperate props object
        const campaign = Campaign(props.query.address)

        const summary = await campaign.methods.getSummary().call();

        return {
            address: props.query.address,
            minContrib: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };
    }

    renderCards(){
        const {
            balance,
            manager,
            minContrib,
            requestsCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minContrib,
                meta: 'Minimum contribution (wei)',
                description: 'Minimum amount required to particpate in campaign',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'Requests enables manager to draw money from contract. Requests need to be approved by contributers.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: approversCount,
                meta: 'Number of approvers',
                description: 'Number of people who have already donated to campaign',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Balance of contract',
                description: 'How much much money is currently held in the contract',
                style: {overflowWrap: 'break-word'}
            }
        ];

        return <Card.Group items={items} />
    }

    render(){
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                            
                        </Grid.Column>
                        <Grid.Column width ={6}>
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>    
                    </Grid.Row> 

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>              
           
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;