import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

/**
 * Error Boundary component to catch and handle errors gracefully
 * Prevents the entire app from crashing
 */
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      errorInfo: errorInfo.componentStack,
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: '',
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 16 }}>
          <ScrollView contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 12 }}>
                ⚠️ Something Went Wrong
              </Text>
              <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 16, textAlign: 'center' }}>
                We encountered an unexpected error. Please try again or contact support if the problem persists.
              </Text>

              {__DEV__ && this.state.error && (
                <View
                  style={{
                    backgroundColor: '#fee2e2',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 16,
                    width: '100%',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#991b1b', fontWeight: '600', marginBottom: 4 }}>
                    Error Details (Development Only):
                  </Text>
                  <Text style={{ fontSize: 11, color: '#7f1d1d', fontFamily: 'monospace' }}>
                    {this.state.error.toString()}
                  </Text>
                  {this.state.errorInfo && (
                    <Text
                      style={{
                        fontSize: 10,
                        color: '#7f1d1d',
                        marginTop: 8,
                        fontFamily: 'monospace',
                      }}
                    >
                      {this.state.errorInfo}
                    </Text>
                  )}
                </View>
              )}

              <TouchableOpacity
                onPress={this.resetError}
                style={{
                  backgroundColor: '#0A8A1F',
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                  Try Again
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
