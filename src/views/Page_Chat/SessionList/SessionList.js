import React from 'react';
import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const createPureComponent = RebixFlux.createPureComponent;
const PureRenderComponent = RebixFlux.PureRenderComponent;
const getDeepValue = RebixUtils.getDeepValue;
import SessionStore from '../../../stores/SessionStore';
import UserAccountStore from '../../../stores/UserAccountStore';
import SessionItem from './SessionItem';
import './SessionList.less';

const CreateSession = createPureComponent(function (props) {
    console.log('CreateSession');
    return (
        <div className="SessionItem CreateSession" onClick={()=>{props.onClick}}>
            <div className="SessionLogo">
                <div className="CreateSessionAvatar">
                    <div className="CreateSessionChar">+</div>
                </div>
            </div>
            <div className="SessionInfo">
                <div className="CreateSessionText">
                    发起新对话
                </div>
            </div>
        </div>
    );
});


function getLastMsg(messageState,session_id){
    var messageList = messageState.get("S" + session_id);
    return messageList && messageList.last();
}

class SessionList extends PureRenderComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleCreateSession = ()=> {

    };

    render() {
        var that = this;
        var {selSessionId,sessions, userAccounts,messageState} = this.props;
        return (
            <div className="SessionList">
                <CreateSession onClick={that.handleCreateSession}/>
                {
                    sessions.map(function (session) {
                        var uid = session.get('uid');
                        var to_sid = session.get('to_sid');
                        var id = session.get('id');
                        var session_id = session.get('session_id');
                        var session_type = session.get('session_type');
                        var userAccount = null;
                        if (session_type === 1) {//1 代表p2p消息 . 2 代表群组消息. 3代表公共会话
                            userAccount = userAccounts.get('U' + to_sid);
                        }
                        var lastMsg = getLastMsg(messageState,session_id);
                        return <SessionItem key={id||session_id}
                                            session={session}
                                            lastMsg = {lastMsg}
                                            userAccount={userAccount}
                                            selSessionId={selSessionId}/>
                    })
                }
            </div>
        )
    }
}

export default RebixFlux.connect(SessionList, function (bigStore, props, context, connectState, that) {
    var sessions = getDeepValue(bigStore, 'sessionState.sessions');
    var userAccounts = getDeepValue(bigStore, 'userAccountState');
    var selSessionId = getDeepValue(bigStore, 'sessionState.selSessionId');
    var messageState = getDeepValue(bigStore,'messageState');
    return {
        selSessionId: selSessionId,
        sessions: sessions,
        userAccounts: userAccounts,
        messageState:messageState
    };
});