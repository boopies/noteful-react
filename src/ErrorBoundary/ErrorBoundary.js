import React from 'react';
import ApiContext from '../ApiContext';
import './ErrorBoundary.css';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          hasError: false
        };
      }

    static contextType = ApiContext;

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

render() {
    if (this.state.hasError) {
        return (<span className="error-message">Something is Quiet Wrong</span>);
    }
    return (<div>
        {this.props.children}
    </div>)
}
}