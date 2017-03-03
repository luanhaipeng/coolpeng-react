import React from 'react';
import RebixFlux from 'react-rebixflux';
import BigStore from '../../stores/BigStore';
import './App.less';
import AppHeader from './AppHeader';
import AppNav from './AppNav';


class AppComponent extends RebixFlux.PureRenderComponent {
    render() {
        return (
            <div className="AppComponent">
                <AppHeader />
                <div className="AppBody">
                    <div className="AppBodyHeaderHeight"></div>
                    <div className="AppBodyContent">
                        <AppNav />
                        <div className="AppBodyChildren">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default RebixFlux.connect(AppComponent, BigStore, function (bigStore, props, context, connectState, that) {
    return {};
});