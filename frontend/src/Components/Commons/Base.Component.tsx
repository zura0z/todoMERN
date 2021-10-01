import React from 'react';

class BaseComponent<P = {}, S = {}> extends React.Component<P, S> {
    constructor(public props: any) {
        super(props);
    }

    get session() {
        return this.props.userLogin.userInfo;
    }

}

export default BaseComponent;
