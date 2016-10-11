import React from 'react'
import {bindActionCreators} from 'redux';
import immutable from 'immutable';
import {createUUID} from '../../../core/utils/index';
import PureRenderComponent from '../../../core/PureRenderComponent';
import Icon from '../../../components/icons/Icon';
import {connect} from 'react-redux';
import ActionStoreHelper from '../../Common/ActionStoreHelper';
import LeftPanelManager,{PANEL_KEY} from './LeftPanelManager';
import './OperationHolder.less';

export default class OperationHolder extends PureRenderComponent {

    constructor(props) {
        super(props);
        this.state = {
            currentPanel:null,
            show:false
        };
    }

    onClickUserIcon(onlineUserList){
        LeftPanelManager.pushPanel(PANEL_KEY.NewSessionPanel,{onlineUserList})
    }

    render(){
        var that = this;
        var state = that.state;
        var {onlineUserList} = that.props;
        return (
            <div className="chat-OperationHolder">
                <Icon icon="users" onClick={that.onClickUserIcon.bind(that,onlineUserList)}></Icon>
            </div>

        );
    }
}

