import React from 'react';
import Component3DButtonDesign from './component-3-d-button-design';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Etwas ist schief gelaufen
          </h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'Ein unerwarteter Fehler ist aufgetreten'}
          </p>
          <Component3DButtonDesign
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Neu laden
          </Component3DButtonDesign>
        </div>
      );
    }

    return this.props.children;
  }
} 