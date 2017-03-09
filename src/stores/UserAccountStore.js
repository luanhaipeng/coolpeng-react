import RebixFlux from 'react-rebixflux';
import RebixUtils from 'rebix-utils';
const keys = RebixUtils.keys;
const forEach = RebixUtils.forEach;
import immutable from 'immutable';


//定义Record可以免去大量get set 方法的使用
const UserAccountRecord = immutable.Record({
    'id': null,
    'token': null,
    'email': null,
    'nickname': null,
    'avatar': null
});

function getInitialState() {
    return new immutable.Map({});
}

function onReceiveUserAccountArrayResult(state, {status, payload}) {
    if (status === 'success') {
        var result = payload || [];
        forEach(result, function (painUserAccount) {
            var uid = painUserAccount.id;
            var userAccountRecord = new UserAccountRecord(painUserAccount);
            state = state.set('U' + uid, userAccountRecord);
        });
    }
    return state;
}

export default RebixFlux.createStore({
    forAction: "user_account",
    initialState: getInitialState(),
    'onGetUserByUidInList': onReceiveUserAccountArrayResult
});