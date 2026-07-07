import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("StudyWise render error:", error, info);
    }
  }

  private reloadPage = () => {
    window.location.reload();
  };

  private goHome = () => {
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="space-y-5 p-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-6" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1>Terjadi Kesalahan</h1>
              <p className="text-sm text-muted-foreground">
                Tampilan StudyWise tidak dapat dimuat dengan benar. Muat ulang
                halaman atau kembali ke beranda untuk mencoba lagi.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button className="min-h-11" onClick={this.reloadPage}>
                <RefreshCw className="size-4" /> Muat Ulang
              </Button>
              <Button className="min-h-11" variant="outline" onClick={this.goHome}>
                <Home className="size-4" /> Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }
}
