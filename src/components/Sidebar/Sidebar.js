import React, { Component } from 'react';
import SlidingPane from 'react-sliding-pane';
import 'react-sliding-pane/dist/react-sliding-pane.css';

class Sidebar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPaneOpen: props.isPaneOpen,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            isPaneOpen: nextProps.isPaneOpen,
        };
    }
    
    
    render() {
        return (
            <div y>
                <SlidingPane
                    className='some-custom-class'
                    overlayClassName='some-custom-overlay-class'
                    isOpen={this.state.isPaneOpen}
                    title='Hey, it is optional pane title.  I can be React component too.'
                    subtitle='Optional subtitle.'
                    from='left'
                    onRequestClose={() => {
                        // triggered on "<" on left top click or on outside click
                        this.props.onClose(false);
                    }}>
                    <div>And I am pane content</div>
                </SlidingPane>
            </div>
        );
    }
}

export default Sidebar;
