import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, PieChart, DollarSign, TrendingUp, BarChart3, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section with Animation */}
        <div className="relative overflow-hidden bg-background py-24 sm:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 animate-gradient">
                Smart Finance Management for Students
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Take control of your finances with our intuitive expense tracking app. 
                Built specifically for students to manage budgets, track expenses, and achieve financial goals.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/register">
                  <Button size="lg" className="gap-2 group animate-pulse-slow">
                    Get Started
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid with Hover Effects */}
        <div className="py-24 bg-muted/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Powerful Features for Better Financial Control
              </h2>
              <p className="text-muted-foreground mb-16">
                Everything you need to manage your student finances effectively
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={cn(
                    "p-6 rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
                    "group cursor-pointer"
                  )}
                >
                  <div className="flex flex-col items-start gap-4">
                    <span className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {feature.icon}
                    </span>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Preview Section */}
        <div className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Detailed Financial Insights
              </h2>
              <p className="text-muted-foreground">
                Get comprehensive reports and analytics to understand your spending habits
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {reports.map((report, index) => (
                <div
                  key={report.title}
                  className="p-6 rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="p-2 rounded-lg bg-primary/10 text-primary">
                      {report.icon}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold">{report.title}</h3>
                      <p className="text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <div className="aspect-[4/3] rounded-lg bg-muted/50 flex items-center justify-center">
                    <span className="text-muted-foreground">Report Preview</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative isolate overflow-hidden bg-primary py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Start Managing Your Finances Today
              </h2>
              <p className="mt-6 text-lg leading-8 text-primary-foreground/80">
                Join thousands of students who are already taking control of their financial future
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link href="/register">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="gap-2 group animate-pulse-slow"
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const features = [
  {
    title: "Smart Budget Management",
    description: "Set and track monthly budgets with intelligent alerts and recommendations.",
    icon: <DollarSign className="h-6 w-6" />,
  },
  {
    title: "Expense Analytics",
    description: "Visualize spending patterns with interactive charts and detailed breakdowns.",
    icon: <PieChart className="h-6 w-6" />,
  },
  {
    title: "Financial Insights",
    description: "Get personalized insights and tips to improve your financial habits.",
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    title: "Monthly Reports",
    description: "Comprehensive monthly reports with detailed analysis of your spending.",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "Category Tracking",
    description: "Track expenses by categories to understand where your money goes.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
  {
    title: "Recurring Expenses",
    description: "Manage and track recurring expenses like subscriptions and bills.",
    icon: <Calendar className="h-6 w-6" />,
  },
];

const reports = [
  {
    title: "Monthly Summary",
    description: "Get a quick overview of your monthly spending and savings.",
    icon: <FileText className="h-6 w-6" />,
  },
  {
    title: "Category Analysis",
    description: "Detailed breakdown of expenses by category with trend analysis.",
    icon: <BarChart3 className="h-6 w-6" />,
  },
];