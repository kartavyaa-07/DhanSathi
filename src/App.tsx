import React from 'react';
import { AppStoreProvider, useAppStore, type Screen } from './store';
import { Shell } from './components/Shell';
import { LangScreen, IncomeScreen, AntiscamScreen, AAScreen, QuizScreen, QuizResultScreen } from './components/OnboardingScreens';
import { DashboardScreen } from './components/DashboardScreen';
import { InsuranceListScreen, InsuranceDetailScreen, EnrollSuccessScreen } from './components/InsuranceScreens';
import { VaaniScreen } from './components/VaaniScreen';
import { InvestListScreen, InvestDetailScreen } from './components/InvestScreens';
import { BorrowScreen, BorrowCompareScreen } from './components/BorrowScreens';
import { ProfileScreen } from './components/ProfileScreen';

const SCREEN_COMPONENTS: Record<Screen, React.FC> = {
  lang: LangScreen,
  income: IncomeScreen,
  antiscam: AntiscamScreen,
  aa: AAScreen,
  quiz: QuizScreen,
  quizresult: QuizResultScreen,
  dashboard: DashboardScreen,
  insurance: InsuranceListScreen,
  insurancedetail: InsuranceDetailScreen,
  vaani: VaaniScreen,
  enrollsuccess: EnrollSuccessScreen,
  investlist: InvestListScreen,
  investdetail: InvestDetailScreen,
  borrow: BorrowScreen,
  borrowcompare: BorrowCompareScreen,
  profile: ProfileScreen,
};

function ScreenRouter() {
  const { s } = useAppStore();
  const ScreenComponent = SCREEN_COMPONENTS[s.screen] || DashboardScreen;
  return <ScreenComponent />;
}

export default function App() {
  return (
    <AppStoreProvider>
      <Shell>
        <ScreenRouter />
      </Shell>
    </AppStoreProvider>
  );
}
