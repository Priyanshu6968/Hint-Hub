import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error);
        console.error('Error info:', errorInfo);

        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex items-center justify-center p-4">
                    <Card className="max-w-2xl w-full border-destructive">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-6 w-6 text-destructive" />
                                <CardTitle className="text-destructive">Application Error</CardTitle>
                            </div>
                            <CardDescription>
                                Something went wrong while loading the application.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {this.state.error && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm">Error Message:</h3>
                                    <pre className="bg-muted p-3 rounded-md text-sm overflow-auto">
                                        {this.state.error.toString()}
                                    </pre>
                                </div>
                            )}

                            {this.state.errorInfo && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-sm">Component Stack:</h3>
                                    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-48">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </div>
                            )}

                            <div className="space-y-2 pt-4">
                                <h3 className="font-semibold text-sm">Common Solutions:</h3>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    <li>Check if all required environment variables are set</li>
                                    <li>Verify Firebase configuration is correct</li>
                                    <li>Check browser console for additional error details</li>
                                    <li>Try clearing browser cache and reloading</li>
                                </ul>
                            </div>

                            <Button
                                onClick={this.handleReset}
                                className="w-full flex items-center gap-2"
                                variant="outline"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Reload Application
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
