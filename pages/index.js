import React, {Component} from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import {Link} from '../routes';

class CampaignIndex extends Component {

    static async getInitialProps(){ 
        //With static fct is assigned to class not instances of class
        //static keyword required by Next.js for efficeny 
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns }
    }

    renderCampaigns(){
        //Below code maps address from deployed campaigns to item object for display as a card
        const items = this.props.campaigns.map( address =>{
            return{
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />
    }

    render(){
        return(
            <Layout>
                <h3>Open Campaigns</h3>

                <Link route="campaigns/new">
                    <a>
                        <Button
                            floated = "right"
                            content="Create Campaign"
                            icon="add circle"
                            primary  // equal to primary={true}
                        />
                    </a>
                </Link>
                {this.renderCampaigns()}
            </Layout>
            );
    };

};

export default CampaignIndex;