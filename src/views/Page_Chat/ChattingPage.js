import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;

class ChattingPage extends PureRenderComponent{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return (
            <div className="ChattingPage">

            </div>
        )
    }
}

export default RebixFlux.connect(ChattingPage,function(store, props, context, connectState, that){

});